import { config } from "./config.js";
import { isWhisperHallucination } from "./filters.js";
import { saveTtsToFile } from "./audio.js";
import type { ChatMessage, WhisperResponse, OpenClawResponse } from "./types.js";

export async function transcribe(wavBuffer: Buffer): Promise<string> {
  const useGroq = config.sttProvider === "groq" && config.groqApiKey;
  const baseUrl = useGroq
    ? "https://api.groq.com/openai/v1/audio/transcriptions"
    : "https://api.openai.com/v1/audio/transcriptions";
  const apiKey = useGroq ? config.groqApiKey! : config.openaiApiKey;
  const model = useGroq ? "distil-whisper-large-v3-en" : "whisper-1";

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([wavBuffer], { type: "audio/wav" }),
    "audio.wav",
  );
  formData.append("model", model);
  formData.append("language", "en");

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
    signal: AbortSignal.timeout(config.apiTimeoutMs),
  });
  if (!res.ok)
    throw new Error(
      `${useGroq ? "Groq" : "Whisper"} ${res.status}: ${await res.text()}`,
    );

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
