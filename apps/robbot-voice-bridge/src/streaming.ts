import { config } from "./config.js";
import type { ChatMessage, SentenceChunk } from "./types.js";

// Abbreviations that end with a period but aren't sentence boundaries
const ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "prof", "sr", "jr", "st", "ave", "blvd",
  "gen", "gov", "sgt", "cpl", "pvt", "capt", "lt", "col", "maj",
  "dept", "univ", "assn", "bros", "inc", "ltd", "co", "corp",
  "vs", "etc", "approx", "appt", "apt", "dept", "est", "min",
  "max", "misc", "tech", "temp", "vet", "vol",
]);

// Patterns that look like sentence-ending periods but aren't
const NOT_SENTENCE_END = [
  // Decimal numbers: "3.14"
  /\d\.\d/,
  // Ellipsis: "..."
  /\.{2,}/,
  // Domain/URL-like: "example.com"
  /\w\.\w{2,}/,
  // Initials like "U.S." or "A.I."
  /\b[A-Z]\.[A-Z]\./,
];

/**
 * Parse SSE lines from a text chunk into content deltas.
 * Returns extracted text content from each `data: {...}` line.
 */
export function parseSSEChunk(chunk: string): Array<string> {
  const deltas: Array<string> = [];
  const lines = chunk.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data: ")) continue;
    const payload = trimmed.slice(6);
    if (payload === "[DONE]") continue;

    try {
      const parsed: { choices?: Array<{ delta?: { content?: string } }> } =
        JSON.parse(payload);
      const content = parsed.choices?.[0]?.delta?.content;
      if (content) deltas.push(content);
    } catch {
      // malformed JSON, skip
    }
  }

  return deltas;
}

/**
 * Detect whether a period at `dotIndex` in `text` is a sentence boundary.
 */
function isPeriodSentenceEnd(text: string, dotIndex: number): boolean {
  // Check if this matches any non-sentence-end pattern
  for (const pattern of NOT_SENTENCE_END) {
    // Check a window around the dot
    const start = Math.max(0, dotIndex - 10);
    const end = Math.min(text.length, dotIndex + 10);
    const window = text.slice(start, end);
    if (pattern.test(window)) return false;
  }

  // Check for abbreviation: word immediately before the dot
  const before = text.slice(0, dotIndex);
  const wordMatch = /(\w+)$/.exec(before);
  if (wordMatch?.[1] && ABBREVIATIONS.has(wordMatch[1].toLowerCase())) {
    return false;
  }

  return true;
}

/**
 * Split accumulated text buffer into complete sentences.
 * Returns [sentences, remainingBuffer].
 */
export function splitSentences(buffer: string): [Array<string>, string] {
  const sentences: Array<string> = [];
  let remaining = buffer;

  while (remaining.length > 0) {
    let splitAt = -1;

    for (let i = 0; i < remaining.length; i++) {
      const char = remaining[i];

      if (char === "!" || char === "?") {
        // These are always sentence boundaries
        const afterChar = remaining[i + 1];
        if (afterChar === " " || afterChar === undefined) {
          splitAt = i + 1;
          break;
        }
      }

      if (char === ".") {
        const afterDot = remaining[i + 1];
        // Need space after or end of string for sentence boundary
        if (afterDot !== " " && afterDot !== undefined) continue;
        if (isPeriodSentenceEnd(remaining, i)) {
          splitAt = i + 1;
          break;
        }
      }
    }

    if (splitAt === -1) break;

    const sentence = remaining.slice(0, splitAt).trim();
    if (sentence.length > 0) {
      sentences.push(sentence);
    }
    remaining = remaining.slice(splitAt).trimStart();
  }

  return [sentences, remaining];
}

const MIN_CHUNK_SIZE = 20;

/**
 * Stream chat completions from OpenClaw, yielding complete sentences.
 * Accumulates the full response text in the returned StreamResult.
 */
export async function* streamOpenClaw(
  text: string,
  history: Array<ChatMessage>,
): AsyncGenerator<SentenceChunk, { fullText: string }> {
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
      stream: true,
      messages: [...history, { role: "user", content: text }],
    }),
    signal: AbortSignal.timeout(config.apiTimeoutMs),
  });

  if (!res.ok) throw new Error(`OpenClaw ${res.status}: ${await res.text()}`);
  if (!res.body) throw new Error("OpenClaw response has no body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";
  let chunkIndex = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const deltas = parseSSEChunk(text);

      for (const delta of deltas) {
        buffer += delta;
        fullText += delta;
      }

      // Try to extract complete sentences from buffer
      if (buffer.length >= MIN_CHUNK_SIZE) {
        const [sentences, remaining] = splitSentences(buffer);
        buffer = remaining;

        for (const sentence of sentences) {
          if (sentence.length >= MIN_CHUNK_SIZE || sentences.length > 1) {
            yield { text: sentence, index: chunkIndex, isFinal: false };
            chunkIndex++;
          } else {
            // Too short, put back in buffer
            buffer = sentence + (buffer ? " " + buffer : "");
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  // Flush remaining buffer
  const trimmed = buffer.trim();
  if (trimmed.length > 0) {
    yield { text: trimmed, index: chunkIndex, isFinal: true };
  }

  return { fullText: fullText.trim() };
}
