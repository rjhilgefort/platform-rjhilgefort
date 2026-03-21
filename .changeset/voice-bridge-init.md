---
"robbot-voice-bridge": minor
---

Add Discord voice bridge for RobBot. Speech capture → Whisper STT → OpenClaw API → OpenAI TTS → voice playback. Supports DAVE E2EE via @discordjs/voice 0.19.1 + @snazzah/davey. Auto-joins voice channels, logs transcripts to #🎙️voice, shares session context with text channel via x-openclaw-session-key header.
