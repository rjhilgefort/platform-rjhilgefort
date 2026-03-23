---
"@repo/openclaw-voice-bridge": patch
---

Fix false interrupts when user is muted. Discord sends speaking events even when a user is self-muted or server-muted — now checks member.voice.selfMute/serverMute before triggering interrupt or processing speech.
