const WHISPER_HALLUCINATIONS = new Set([
  "thank you.",
  "thank you",
  "thanks.",
  "thanks",
  "thanks for watching.",
  "thanks for watching!",
  "thanks for watching",
  "thank you for watching.",
  "thank you for watching",
  "subscribe to my channel.",
  "subscribe.",
  "you",
  "bye.",
  "bye!",
  "bye",
  "the end.",
  "the end",
  "...",
  "so",
  "i'm sorry.",
  "okay.",
  "oh.",
]);

export function isWhisperHallucination(text: string): boolean {
  return WHISPER_HALLUCINATIONS.has(text.toLowerCase());
}
