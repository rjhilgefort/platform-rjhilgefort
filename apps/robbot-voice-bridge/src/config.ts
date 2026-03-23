function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) throw new Error(`Missing required env var: ${name}`);
  if (value === "") throw new Error(`Env var ${name} is set but empty`);
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
  thinkingIndicatorEnabled: (process.env["THINKING_INDICATOR_ENABLED"] ?? "true") === "true",
  interruptEnabled: (process.env["INTERRUPT_ENABLED"] ?? "true") === "true",
  interruptMinDurationMs: (() => {
    const ms = parseInt(process.env["INTERRUPT_MIN_DURATION_MS"] ?? "300", 10);
    if (Number.isNaN(ms) || ms < 0)
      throw new Error("INTERRUPT_MIN_DURATION_MS must be a positive number");
    return ms;
  })(),
  silenceMs: (() => {
    const ms = parseInt(process.env["SILENCE_THRESHOLD_MS"] ?? "1500", 10);
    if (Number.isNaN(ms) || ms < 0)
      throw new Error("SILENCE_THRESHOLD_MS must be a positive number");
    return ms;
  })(),
  sampleRate: 48_000,
  channels: 2,
  apiTimeoutMs: (() => {
    const ms = parseInt(process.env["API_TIMEOUT_MS"] ?? "60000", 10);
    if (Number.isNaN(ms) || ms < 0)
      throw new Error("API_TIMEOUT_MS must be a positive number");
    return ms;
  })(),
  maxHistory: 60,
} as const;
