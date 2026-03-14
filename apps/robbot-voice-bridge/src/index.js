import { Client, GatewayIntentBits, Events } from "discord.js";
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  EndBehaviorType,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} from "@discordjs/voice";
import OpusScript from "opusscript";
const OpusEncoder = OpusScript;
import { unlinkSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

// ── Config ──────────────────────────────────────────────────────────
const {
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  VOICE_LOG_CHANNEL_ID,
  OPENAI_API_KEY,
  OPENCLAW_GATEWAY_URL,
  OPENCLAW_GATEWAY_TOKEN,
  OPENCLAW_AGENT_ID = "main",
  TTS_VOICE = "nova",
  SILENCE_THRESHOLD_MS = "1500",
} = process.env;

const SILENCE_MS = parseInt(SILENCE_THRESHOLD_MS, 10);
const SAMPLE_RATE = 48000;
const CHANNELS = 2;

// ── Discord Client ──────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let voiceConnection = null;
let audioPlayer = null;
let logChannel = null;
let isProcessing = false;
const conversationHistory = []; // rolling message history
const MAX_HISTORY = 60; // keep last 20 messages (10 exchanges) // prevent overlapping pipeline runs

// ── Helpers ─────────────────────────────────────────────────────────

function pcmToWav(pcmBuffer, sampleRate, channels) {
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]);
}

async function transcribe(wavBuffer) {
  const formData = new FormData();
  formData.append("file", new Blob([wavBuffer], { type: "audio/wav" }), "audio.wav");
  formData.append("model", "whisper-1");
  formData.append("language", "en");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: formData,
  });
  if (!res.ok) throw new Error(`Whisper ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.text?.trim() || "";
}

async function askOpenClaw(text, history = []) {
  const res = await fetch(`${OPENCLAW_GATEWAY_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENCLAW_GATEWAY_TOKEN}`,
    },
    body: JSON.stringify({
      model: OPENCLAW_AGENT_ID,
      messages: [...history, { role: "user", content: text }],
    }),
  });
  if (!res.ok) throw new Error(`OpenClaw ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

async function generateTTS(text) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "tts-1",
      voice: TTS_VOICE,
      input: text.slice(0, 4096), // TTS limit
      response_format: "mp3",
    }),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}: ${await res.text()}`);

  const mp3Path = join(tmpdir(), `robbot-tts-${randomUUID()}.mp3`);
  await writeFile(mp3Path, Buffer.from(await res.arrayBuffer()));
  return mp3Path;
}

function playAudio(filePath) {
  if (!voiceConnection || !audioPlayer) return Promise.resolve();
  const resource = createAudioResource(filePath);
  audioPlayer.play(resource);
  return new Promise((resolve) => {
    const cleanup = () => { try { unlinkSync(filePath); } catch {} resolve(); };
    audioPlayer.once(AudioPlayerStatus.Idle, cleanup);
    setTimeout(cleanup, 60_000);
  });
}

async function logExchange(userName, userText, botResponse) {
  if (!logChannel) return;
  try {
    const msg = `🎤 **${userName}:** ${userText}\n🦞 **RobBot:** ${botResponse}`;
    await logChannel.send(msg.slice(0, 2000));
  } catch (err) {
    console.error("[log]", err.message);
  }
}

// ── Voice Processing Pipeline ───────────────────────────────────────

async function handleSpeech(userId, pcmChunks) {
  const pcmBuffer = Buffer.concat(pcmChunks);
  const durationSec = pcmBuffer.length / (SAMPLE_RATE * CHANNELS * 2);

  if (durationSec < 0.5) {
    console.log(`[skip] Too short (${durationSec.toFixed(1)}s)`);
    return;
  }

  if (isProcessing) {
    console.log("[skip] Already processing, dropping utterance");
    return;
  }
  isProcessing = true;

  console.log(`[speech] ${durationSec.toFixed(1)}s from ${userId}`);

  try {
    // 1. Transcribe
    const wavBuffer = pcmToWav(pcmBuffer, SAMPLE_RATE, CHANNELS);
    console.log("[1/4] Transcribing...");
    const text = await transcribe(wavBuffer);
    if (!text || text.length < 2) {
      console.log("[1/4] Empty transcription");
      return;
    }
    console.log(`[1/4] "${text}"`);

    // 2. Ask OpenClaw (with conversation history)
    console.log("[2/4] Asking OpenClaw...");
    const response = await askOpenClaw(text, conversationHistory);
    if (!response) {
      console.log("[2/4] Empty response");
      return;
    }
    // Update conversation history
    conversationHistory.push({ role: "user", content: text });
    conversationHistory.push({ role: "assistant", content: response });
    while (conversationHistory.length > MAX_HISTORY) conversationHistory.shift();
    console.log(`[2/4] "${response.slice(0, 120)}..."`);

    // 3. Generate TTS
    console.log("[3/4] Generating TTS...");
    const ttsPath = await generateTTS(response);

    // 4. Play back
    console.log("[4/4] Playing...");
    await playAudio(ttsPath);
    console.log("[done]");

    // Log transcript
    const member = await client.guilds.cache.get(DISCORD_GUILD_ID)?.members.fetch(userId).catch(() => null);
    const userName = member?.displayName || userId;
    await logExchange(userName, text, response);
  } catch (err) {
    console.error("[pipeline]", err.message);
  } finally {
    isProcessing = false;
  }
}

// ── Voice Receiver ──────────────────────────────────────────────────

function setupReceiver(connection) {
  const decoder = new OpusEncoder(SAMPLE_RATE, CHANNELS);
  const activeStreams = new Map();

  connection.receiver.speaking.on("start", (userId) => {
    if (userId === client.user.id) return;
    if (activeStreams.has(userId)) return;

    const pcmChunks = [];
    const opusStream = connection.receiver.subscribe(userId, {
      end: { behavior: EndBehaviorType.AfterSilence, duration: SILENCE_MS },
    });

    activeStreams.set(userId, true);

    opusStream.on("data", (packet) => {
      try {
        const decoded = decoder.decode(packet);
        pcmChunks.push(Buffer.from(decoded));
      } catch {}
    });

    opusStream.on("end", () => {
      activeStreams.delete(userId);
      handleSpeech(userId, pcmChunks);
    });

    opusStream.on("error", (err) => {
      console.error(`[stream] ${userId}:`, err.message);
      activeStreams.delete(userId);
    });
  });
}

// ── Auto-join ───────────────────────────────────────────────────────

async function autoJoin(guild) {
  const vc = guild.channels.cache.find(
    (c) => c.type === 2 && c.members.some((m) => !m.user.bot)
  );
  if (!vc) return;

  console.log(`[bot] Auto-joining ${vc.name}...`);
  voiceConnection = joinVoiceChannel({
    channelId: vc.id,
    guildId: vc.guild.id,
    adapterCreator: vc.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });

  audioPlayer = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Play },
  });
  voiceConnection.subscribe(audioPlayer);

  try {
    await entersState(voiceConnection, VoiceConnectionStatus.Ready, 30_000);
    setupReceiver(voiceConnection);
    console.log("[bot] Connected and listening!");
  } catch (err) {
    console.error("[bot] Failed:", err.message);
    voiceConnection?.destroy();
    voiceConnection = null;
  }
}

// ── Bot Commands ────────────────────────────────────────────────────

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content === "!join") {
    const vc = message.member?.voice?.channel;
    if (!vc) return message.reply("Join a voice channel first!");
    if (voiceConnection) voiceConnection.destroy();

    voiceConnection = joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });
    audioPlayer = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
    voiceConnection.subscribe(audioPlayer);

    try {
      await entersState(voiceConnection, VoiceConnectionStatus.Ready, 30_000);
      setupReceiver(voiceConnection);
      await message.reply("🦞 Listening!");
    } catch {
      await message.reply("Failed to connect.");
      voiceConnection?.destroy();
      voiceConnection = null;
    }
  }

  if (message.content === "!leave") {
    voiceConnection?.destroy();
    voiceConnection = null;
    audioPlayer = null;
    await message.reply("👋");
  }
});

// ── Voice State Handling ────────────────────────────────────────────

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  if (newState.channel && !voiceConnection && !newState.member.user.bot) {
    await autoJoin(newState.guild);
  }
  if (oldState.channel && voiceConnection) {
    const humans = oldState.channel.members.filter((m) => !m.user.bot);
    if (humans.size === 0) {
      console.log("[bot] Everyone left, disconnecting");
      voiceConnection.destroy();
      voiceConnection = null;
      audioPlayer = null;
    }
  }
});

// ── Startup ─────────────────────────────────────────────────────────

client.once(Events.ClientReady, async () => {
  console.log(`[bot] Logged in as ${client.user.tag}`);
  const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
  if (!guild) { console.error("[bot] Guild not found!"); process.exit(1); }
  logChannel = guild.channels.cache.get(VOICE_LOG_CHANNEL_ID) || null;
  if (logChannel) console.log(`[bot] Log channel: #${logChannel.name}`);
  await autoJoin(guild);
});

client.login(DISCORD_BOT_TOKEN);
