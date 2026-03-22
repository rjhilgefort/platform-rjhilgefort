import type { Client } from "discord.js";
import { config } from "./config.js";
import { pcmToWav, playAudio, playAudioStream, AudioQueue } from "./audio.js";
import { transcribe, askOpenClaw, generateTTS, generateTTSStream } from "./api.js";
import { streamOpenClaw } from "./streaming.js";
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

/**
 * Interrupt the active pipeline — abort LLM stream, clear audio queue, stop playback.
 */
export function interruptPipeline(state: VoiceState): void {
  if (state.isInterrupting) return;
  state.isInterrupting = true;

  console.log("[interrupt] Interrupting active pipeline");

  state.abortController?.abort();
  state.abortController = null;

  state.activeAudioQueue?.interrupt();
  state.activeAudioQueue = null;

  state.audioPlayer?.stop();

  state.isProcessing = false;
  state.isInterrupting = false;
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

  const abortController = new AbortController();
  state.abortController = abortController;

  console.log(`[speech] ${durationSec.toFixed(1)}s from ${userId}`);

  try {
    // 1. Transcribe
    const wavBuffer = pcmToWav(pcmBuffer, config.sampleRate, config.channels);
    console.log("[1/3] Transcribing...");
    const text = await transcribe(wavBuffer);
    if (!text || text.length < 2) {
      console.log("[1/3] Empty transcription");
      return;
    }
    console.log(`[1/3] "${text}"`);

    // 2. Stream LLM + TTS pipeline
    console.log("[2/3] Streaming LLM → TTS...");
    const audioQueue = new AudioQueue();
    state.activeAudioQueue = audioQueue;
    let fullText = "";
    let interrupted = false;

    try {
      const generator = streamOpenClaw(text, state.conversationHistory, abortController.signal);

      for (;;) {
        const { value, done } = await generator.next();
        if (done) {
          fullText = value.fullText;
          break;
        }

        const sentence = value;
        const preview = sentence.text.length > 60
          ? `${sentence.text.slice(0, 60)}...`
          : sentence.text;
        console.log(`[2/3] chunk ${sentence.index}: "${preview}"`);

        // Fire off TTS + queue playback for each sentence
        // Falls back to file-based TTS if streaming fails
        try {
          const ttsStream = await generateTTSStream(sentence.text);
          audioQueue.enqueue(() =>
            playAudioStream(ttsStream, state.audioPlayer),
          );
        } catch (ttsErr) {
          console.warn(`[2/3] TTS stream failed for chunk ${sentence.index}, trying file-based`);
          try {
            const ttsPath = await generateTTS(sentence.text);
            audioQueue.enqueue(() => playAudio(ttsPath, state.audioPlayer));
          } catch {
            console.warn(`[2/3] TTS failed entirely for chunk ${sentence.index}, skipping`);
          }
        }
      }
    } catch (streamErr) {
      if (abortController.signal.aborted) {
        console.log("[2/3] Pipeline interrupted by user speech");
        interrupted = true;
      } else {
        // Fallback to non-streaming path
        console.warn("[2/3] Stream failed, falling back:", streamErr instanceof Error ? streamErr.message : streamErr);
        const response = await askOpenClaw(text, state.conversationHistory);
        if (!response) {
          console.log("[2/3] Empty response");
          return;
        }
        fullText = response;

        const ttsPath = await generateTTS(response);
        await playAudio(ttsPath, state.audioPlayer);
      }
    }

    if (!interrupted) {
      // 3. Wait for all audio to finish
      console.log("[3/3] Waiting for playback...");
      await audioQueue.waitForAll();
    }

    if (!fullText) {
      console.log("[2/3] Empty response");
      return;
    }

    // Update history (even partial on interrupt)
    state.conversationHistory.push({ role: "user", content: text });
    state.conversationHistory.push({
      role: "assistant",
      content: interrupted ? `${fullText} [interrupted]` : fullText,
    });
    while (state.conversationHistory.length > config.maxHistory) {
      state.conversationHistory.shift();
    }

    if (interrupted) {
      console.log(`[interrupted] partial: "${fullText.slice(0, 120)}..."`);
    } else {
      console.log(`[done] "${fullText.slice(0, 120)}..."`);
    }

    // Log transcript
    const guild = client.guilds.cache.get(config.discordGuildId);
    const member = await guild?.members.fetch(userId).catch(() => null);
    const userName = member?.displayName ?? userId;
    await logExchange(state, userName, text, fullText);
  } catch (err) {
    if (abortController.signal.aborted) {
      console.log("[pipeline] Aborted by interrupt");
    } else {
      console.error("[pipeline]", err instanceof Error ? err.message : err);
    }
  } finally {
    state.abortController = null;
    state.activeAudioQueue = null;
    state.isProcessing = false;
  }
}
