import { config } from "./config.js";
import { isWhisperHallucination } from "./filters.js";
import { saveTtsToFile } from "./audio.js";
import type { ChatMessage, WhisperResponse, OpenClawResponse } from "./types.js";

export async function transcribe(wavBuffer: Buffer): Promise<string> {
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([wavBuffer], { type: "audio/wav" }),
    "audio.wav",
  );
  formData.append("model", "whisper-1");
  formData.append("language", "en");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.openaiApiKey}` },
    body: formData,
    signal: AbortSignal.timeout(config.apiTimeoutMs),
  });
  if (!res.ok) throw new Error(`Whisper ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as WhisperResponse;
  const text = data.text?.trim() ?? "";

  if (isWhisperHallucination(text)) {
    console.log(`[whisper] Filtered hallucination: "${text}"`);
    return "";
  }

  return text;
}

export async function askOpenClaw(
  text: string,
  history: Array<ChatMessage>,
): Promise<string> {
  const res = await fetch(`${config.openclawGatewayUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openclawGatewayToken}`,
      "x-openclaw-agent-id": config.openclawAgentId,
      "x-openclaw-session-key": `agent:${config.openclawAgentId}:discord:channel:${config.voiceLogChannelId}`,
    },
    body: JSON.stringify({
      model: "openclaw",
      messages: [...history, { role: "user", content: text }],
    }),
    signal: AbortSignal.timeout(config.apiTimeoutMs),
  });
  if (!res.ok) throw new Error(`OpenClaw ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as OpenClawResponse;
  return data.choices[0]?.message?.content?.trim() ?? "";
}

export async function generateTTS(text: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "tts-1",
      voice: config.ttsVoice,
      input: text.slice(0, 4096),
      response_format: "mp3",
    }),
    signal: AbortSignal.timeout(config.apiTimeoutMs),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}: ${await res.text()}`);

  return saveTtsToFile(await res.arrayBuffer());
}

/**
 * Generate TTS and return the response body as a ReadableStream (Opus/OGG format).
 * Streams directly — no temp file.
 */
export async function generateTTSStream(
  text: string,
): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "tts-1",
      voice: config.ttsVoice,
      input: text.slice(0, 4096),
      response_format: "opus",
    }),
    signal: AbortSignal.timeout(config.apiTimeoutMs),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}: ${await res.text()}`);
  if (!res.body) throw new Error("TTS response has no body");

  return res.body;
}
