---
"@repo/openclaw-voice-bridge": minor
---

Reduce voice pipeline latency: add Groq Whisper STT support (~200ms vs ~1.5s), lower default silence threshold from 1.5s to 1.0s. Groq is used automatically when GROQ_API_KEY is set, falls back to OpenAI Whisper otherwise.
