"""RobBot Voice Bridge — Python/py-cord edition.

Pipeline: Discord voice → Whisper STT → OpenClaw HTTP API → OpenAI TTS → Discord playback
Logs transcripts to #🎙️voice.
"""

import asyncio
import io
import os
import struct
import tempfile
import wave
from pathlib import Path

import discord
from discord.ext import commands
from dotenv import load_dotenv

# Load .env from parent directory
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

TOKEN = os.environ["DISCORD_BOT_TOKEN"]
GUILD_ID = int(os.environ["DISCORD_GUILD_ID"])
VOICE_LOG_CHANNEL_ID = int(os.environ["VOICE_LOG_CHANNEL_ID"])
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
OPENCLAW_GATEWAY_URL = os.environ["OPENCLAW_GATEWAY_URL"]
OPENCLAW_GATEWAY_TOKEN = os.environ["OPENCLAW_GATEWAY_TOKEN"]
OPENCLAW_AGENT_ID = os.environ.get("OPENCLAW_AGENT_ID", "main")
TTS_VOICE = os.environ.get("TTS_VOICE", "nova")
SILENCE_MS = int(os.environ.get("SILENCE_THRESHOLD_MS", "1500"))

# ── HTTP helpers (using stdlib to avoid extra deps) ──────────────────
import json
import urllib.request
from urllib.parse import urljoin

# But we do use the openai package for cleaner Whisper/TTS calls
import openai

oai = openai.OpenAI(api_key=OPENAI_API_KEY)


async def transcribe_audio(wav_bytes: bytes) -> str:
    """Send WAV audio to Whisper and return transcription text."""
    def _call():
        buf = io.BytesIO(wav_bytes)
        buf.name = "audio.wav"
        result = oai.audio.transcriptions.create(
            model="whisper-1",
            file=buf,
            language="en",
        )
        return result.text.strip() if result.text else ""
    return await asyncio.to_thread(_call)


async def ask_openclaw(text: str) -> str:
    """Send user text to OpenClaw HTTP API and return the response."""
    def _call():
        payload = json.dumps({
            "model": OPENCLAW_AGENT_ID,
            "messages": [{"role": "user", "content": text}],
        }).encode()
        req = urllib.request.Request(
            f"{OPENCLAW_GATEWAY_URL}/v1/chat/completions",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {OPENCLAW_GATEWAY_TOKEN}",
            },
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        return content.strip()
    return await asyncio.to_thread(_call)


async def generate_tts(text: str) -> str:
    """Generate TTS audio via OpenAI and return path to mp3 file."""
    def _call():
        response = oai.audio.speech.create(
            model="tts-1",
            voice=TTS_VOICE,
            input=text[:4096],
            response_format="mp3",
        )
        tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
        response.stream_to_file(tmp.name)
        return tmp.name
    return await asyncio.to_thread(_call)


# ── Custom Sink that collects PCM per user ───────────────────────────

class BufferSink(discord.sinks.Sink):
    """Collects raw PCM audio per user into memory buffers."""

    def __init__(self):
        super().__init__()
        self.audio_data = {}

    def write(self, data, user):
        if user not in self.audio_data:
            self.audio_data[user] = io.BytesIO()
        self.audio_data[user].write(data)

    def cleanup(self):
        self.audio_data.clear()


# ── Bot ──────────────────────────────────────────────────────────────

intents = discord.Intents.default()
intents.message_content = True
intents.voice_states = True

bot = commands.Bot(command_prefix="!", intents=intents)

processing_lock = asyncio.Lock()
voice_log_channel = None


def pcm_to_wav(pcm_bytes: bytes, sample_rate=48000, channels=2, sample_width=2) -> bytes:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_bytes)
    return buf.getvalue()


async def handle_recording(sink: BufferSink, channel, *args):
    """Called when recording stops. Process each user's audio."""
    for user_id, audio_buf in sink.audio_data.items():
        pcm_bytes = audio_buf.getvalue()
        duration = len(pcm_bytes) / (48000 * 2 * 2)  # 48kHz, stereo, 16-bit

        if duration < 0.5:
            print(f"[skip] Too short ({duration:.1f}s) from {user_id}")
            continue

        print(f"[speech] {duration:.1f}s from {user_id}")

        async with processing_lock:
            try:
                # 1. Transcribe
                wav_bytes = pcm_to_wav(pcm_bytes)
                print("[1/4] Transcribing...")
                text = await transcribe_audio(wav_bytes)
                if not text or len(text) < 2:
                    print("[1/4] Empty transcription")
                    continue
                print(f'[1/4] "{text}"')

                # 2. Ask OpenClaw
                print("[2/4] Asking OpenClaw...")
                response = await ask_openclaw(text)
                if not response:
                    print("[2/4] Empty response")
                    continue
                print(f'[2/4] "{response[:120]}..."')

                # 3. Generate TTS
                print("[3/4] Generating TTS...")
                tts_path = await generate_tts(response)

                # 4. Play back
                vc = channel.guild.voice_client
                if vc and vc.is_connected():
                    print("[4/4] Playing...")
                    source = discord.FFmpegPCMAudio(tts_path)
                    vc.play(source)
                    while vc.is_playing():
                        await asyncio.sleep(0.1)
                    try:
                        os.unlink(tts_path)
                    except OSError:
                        pass
                    print("[done]")

                # 5. Log transcript
                if voice_log_channel:
                    member = channel.guild.get_member(user_id)
                    name = member.display_name if member else str(user_id)
                    msg = f"🎤 **{name}:** {text}\n🦞 **RobBot:** {response}"
                    await voice_log_channel.send(msg[:2000])

            except Exception as e:
                print(f"[pipeline] Error: {e}")


# ── Continuous recording loop ────────────────────────────────────────

async def recording_loop(vc):
    """Continuously record in short bursts, processing each one."""
    while vc.is_connected():
        sink = BufferSink()
        vc.start_recording(sink, handle_recording, vc.channel)
        # Record for SILENCE_MS + buffer
        await asyncio.sleep(SILENCE_MS / 1000 + 1.5)

        # Only stop if still recording
        if vc.recording:
            vc.stop_recording()

        # Wait for processing to finish before next recording
        async with processing_lock:
            pass

        await asyncio.sleep(0.2)


@bot.event
async def on_ready():
    global voice_log_channel
    print(f"[bot] Logged in as {bot.user}")

    guild = bot.get_guild(GUILD_ID)
    if not guild:
        print("[bot] Guild not found!")
        return

    voice_log_channel = guild.get_channel(VOICE_LOG_CHANNEL_ID)
    if voice_log_channel:
        print(f"[bot] Log channel: #{voice_log_channel.name}")

    # Auto-join if someone is in a voice channel
    for vc_channel in guild.voice_channels:
        humans = [m for m in vc_channel.members if not m.bot]
        if humans:
            print(f"[bot] Auto-joining {vc_channel.name}...")
            vc = await vc_channel.connect()
            print("[bot] Connected! Starting recording loop...")
            bot.loop.create_task(recording_loop(vc))
            break


@bot.command()
async def join(ctx):
    if not ctx.author.voice:
        return await ctx.reply("Join a voice channel first!")
    vc = await ctx.author.voice.channel.connect()
    await ctx.reply("🦞 Listening!")
    bot.loop.create_task(recording_loop(vc))


@bot.command()
async def leave(ctx):
    if ctx.voice_client:
        ctx.voice_client.stop_recording() if ctx.voice_client.recording else None
        await ctx.voice_client.disconnect()
        await ctx.reply("👋")


@bot.event
async def on_voice_state_update(member, before, after):
    guild = bot.get_guild(GUILD_ID)
    if not guild:
        return

    # Auto-join when someone enters a VC and bot isn't connected
    if after.channel and not guild.voice_client and not member.bot:
        vc = await after.channel.connect()
        print(f"[bot] Auto-joined {after.channel.name}")
        bot.loop.create_task(recording_loop(vc))

    # Leave if everyone else left
    if before.channel and guild.voice_client:
        humans = [m for m in before.channel.members if not m.bot]
        if not humans:
            print("[bot] Everyone left, disconnecting")
            if guild.voice_client.recording:
                guild.voice_client.stop_recording()
            await guild.voice_client.disconnect()


bot.run(TOKEN)
