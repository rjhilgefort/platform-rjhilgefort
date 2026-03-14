# RobBot Voice Bridge

Discord voice bridge that enables voice conversations with RobBot (OpenClaw).

## Pipeline

1. **Listen** — Captures speech from Discord voice channel
2. **Transcribe** — OpenAI Whisper STT
3. **Think** — Sends text to OpenClaw HTTP API, receives response
4. **Speak** — OpenAI TTS generates audio, plays back in voice channel
5. **Log** — Full transcript posted to `#🎙️voice` text channel

## Requirements

- Node.js 22+
- ffmpeg (for audio processing)
- Discord bot with Voice permissions + Privileged Gateway Intents
- OpenAI API key (Whisper + TTS)
- OpenClaw gateway with HTTP API enabled

## Setup

```bash
cp .env.example .env
# Fill in your tokens
npm install
npm start
```

## Key Dependencies

- `@discordjs/voice` 0.19.1 — Discord voice connection
- `@snazzah/davey` — DAVE E2EE protocol support (mandatory since March 2, 2026)
- `sodium-native` — Encryption performance
- `opusscript` — Opus audio decoding

## Commands

- `!join` — Join your voice channel
- `!leave` — Leave voice channel
- Auto-joins when someone enters a voice channel
- Auto-leaves when everyone else leaves
