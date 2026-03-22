---
"@repo/openclaw-voice-bridge": minor
---

Add interrupt support: start talking while the bot is speaking and it immediately stops, listens, and processes your new input. Aborts in-flight LLM streams, clears TTS queue, preserves partial response in conversation history. Configurable via INTERRUPT_ENABLED env var (default: true), with 300ms minimum sound duration to avoid false triggers from noise.
