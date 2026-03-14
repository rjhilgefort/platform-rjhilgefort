# RobBot Voice Bridge

A lightweight Discord bot that bridges voice channels to RobBot (OpenClaw).

## How it works

1. Bot joins a Discord voice channel
2. Listens to your microphone, detects when you stop talking
3. Transcribes speech via OpenAI Whisper
4. Sends the text to RobBot via OpenClaw's HTTP API
5. Logs both your speech and RobBot's reply in a text channel
6. Plays RobBot's reply as TTS audio in the voice channel

## Setup

1. Create a Discord application at https://discord.com/developers/applications
2. Add a bot, copy the token
3. Enable **Message Content Intent** and **Server Members Intent**
4. Invite the bot with voice + message permissions
5. Copy `.env.example` to `.env` and fill in values
6. `npm install && npm start`

## Usage

- `!join` — Bot joins your current voice channel
- `!leave` — Bot leaves the voice channel

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_BOT_TOKEN` | Bot token for the voice bridge |
| `DISCORD_GUILD_ID` | Your Discord server ID |
| `VOICE_LOG_CHANNEL_ID` | Text channel for conversation logs |
| `OPENAI_API_KEY` | For Whisper STT + TTS |
| `OPENCLAW_GATEWAY_URL` | RobBot gateway URL |
| `OPENCLAW_GATEWAY_TOKEN` | Gateway auth token |
| `OPENCLAW_AGENT_ID` | Agent to talk to (default: main) |
| `TTS_VOICE` | OpenAI TTS voice (default: nova) |
| `SILENCE_THRESHOLD_MS` | Silence before processing (default: 1500) |
