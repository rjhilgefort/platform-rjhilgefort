function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const config = {
  discordBotToken: requireEnv("DISCORD_BOT_TOKEN"),
  discordGuildId: requireEnv("DISCORD_GUILD_ID"),
  voiceLogChannelId: requireEnv("VOICE_LOG_CHANNEL_ID"),
  openaiApiKey: requireEnv("OPENAI_API_KEY"),
  openclawGatewayUrl: requireEnv("OPENCLAW_GATEWAY_URL"),
  openclawGatewayToken: requireEnv("OPENCLAW_GATEWAY_TOKEN"),
  openclawAgentId: process.env["OPENCLAW_AGENT_ID"] ?? "main",
  ttsVoice: process.env["TTS_VOICE"] ?? "nova",
  silenceMs: parseInt(process.env["SILENCE_THRESHOLD_MS"] ?? "1500", 10),
  sampleRate: 48_000,
  channels: 2,
  apiTimeoutMs: 30_000,
  maxHistory: 60,
} as const;
