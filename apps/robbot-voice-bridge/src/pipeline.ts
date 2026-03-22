import type { Client } from "discord.js";
import { config } from "./config.js";
import { pcmToWav, playAudio } from "./audio.js";
import { transcribe, askOpenClaw, generateTTS } from "./api.js";
import type { VoiceState } from "./types.js";

async function logExchange(
  state: VoiceState,
  userName: string,
  userText: string,
  botResponse: string,
): Promise<void> {
  if (!state.logChannel) return;
  try {
    const msg = `🎤 **${userName}:** ${userText}\n🦞 **RobBot:** ${botResponse}`;
    await state.logChannel.send(msg.slice(0, 2000));
  } catch (err) {
    console.error("[log]", err instanceof Error ? err.message : err);
  }
}

export async function handleSpeech(
  client: Client<true>,
  state: VoiceState,
  userId: string,
  pcmChunks: Array<Buffer>,
): Promise<void> {
  const pcmBuffer = Buffer.concat(pcmChunks);
  const durationSec =
    pcmBuffer.length / (config.sampleRate * config.channels * 2);

  if (durationSec < 0.5) {
    console.log(`[skip] Too short (${durationSec.toFixed(1)}s)`);
    return;
  }

  if (state.isProcessing) {
    console.log("[skip] Already processing, dropping utterance");
    return;
  }
  state.isProcessing = true;

  console.log(`[speech] ${durationSec.toFixed(1)}s from ${userId}`);

  try {
    // 1. Transcribe
    const wavBuffer = pcmToWav(pcmBuffer, config.sampleRate, config.channels);
    console.log("[1/4] Transcribing...");
    const text = await transcribe(wavBuffer);
    if (!text || text.length < 2) {
      console.log("[1/4] Empty transcription");
      return;
    }
    console.log(`[1/4] "${text}"`);

    // 2. Ask OpenClaw
    console.log("[2/4] Asking OpenClaw...");
    const response = await askOpenClaw(text, state.conversationHistory);
    if (!response) {
      console.log("[2/4] Empty response");
      return;
    }
    state.conversationHistory.push({ role: "user", content: text });
    state.conversationHistory.push({ role: "assistant", content: response });
    while (state.conversationHistory.length > config.maxHistory) {
      state.conversationHistory.shift();
    }
    console.log(`[2/4] "${response.slice(0, 120)}..."`);

    // 3. Generate TTS
    console.log("[3/4] Generating TTS...");
    const ttsPath = await generateTTS(response);

    // 4. Play back
    console.log("[4/4] Playing...");
    await playAudio(ttsPath, state.audioPlayer);
    console.log("[done]");

    // Log transcript
    const guild = client.guilds.cache.get(config.discordGuildId);
    const member = await guild?.members.fetch(userId).catch(() => null);
    const userName = member?.displayName ?? userId;
    await logExchange(state, userName, text, response);
  } catch (err) {
    console.error("[pipeline]", err instanceof Error ? err.message : err);
  } finally {
    state.isProcessing = false;
  }
}
