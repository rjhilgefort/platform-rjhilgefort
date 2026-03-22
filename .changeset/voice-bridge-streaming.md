---
"@repo/openclaw-voice-bridge": minor
---

Stream LLM responses sentence-by-sentence into TTS for dramatically reduced time-to-first-audio. Sentences are detected with smart boundary parsing (handles abbreviations, decimals, URLs, ellipsis). TTS uses opus format streamed directly to Discord player — no temp files. Falls back to non-streaming pipeline on error. 105 tests passing.
