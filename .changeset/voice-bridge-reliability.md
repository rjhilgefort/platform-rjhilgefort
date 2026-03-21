---
"robbot-voice-bridge": patch
---

Reliability and correctness improvements from code review:
- Fix session key routing (x-openclaw-session-key + x-openclaw-agent-id headers)
- Add 30s API timeouts to prevent permanent hangs on Whisper/OpenClaw/TTS calls
- Add Whisper hallucination filter to skip phantom transcriptions on silence
- Add voice connection disconnect recovery (handles Discord server migrations)
- Fix auto-leave to verify bot is in the correct channel before disconnecting
- Log opus decode errors instead of silently swallowing them
- Fix misleading MAX_HISTORY comment (60 messages = 30 exchanges)
