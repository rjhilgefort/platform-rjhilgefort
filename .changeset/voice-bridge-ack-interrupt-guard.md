---
"@repo/openclaw-voice-bridge": minor
---

Two UX improvements: (1) Quick acknowledgment ("On it", "Got it", etc.) plays immediately after transcription so you know the bot heard you before it starts thinking. (2) Interrupts only fire during audio playback, not during thinking/tool-call phase — prevents false silences when the bot is processing but hasn't started talking yet.
