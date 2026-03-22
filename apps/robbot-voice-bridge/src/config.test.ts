import { describe, it, expect, vi, beforeEach } from "vitest";

// We test requireEnv behavior by dynamically importing config.ts
// since config runs at import time, each test needs a fresh import.

describe("config", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  function setRequiredEnvs() {
    vi.stubEnv("DISCORD_BOT_TOKEN", "test-token");
    vi.stubEnv("DISCORD_GUILD_ID", "test-guild");
    vi.stubEnv("VOICE_LOG_CHANNEL_ID", "test-channel");
    vi.stubEnv("OPENAI_API_KEY", "test-openai");
    vi.stubEnv("OPENCLAW_GATEWAY_URL", "https://test.example.com");
    vi.stubEnv("OPENCLAW_GATEWAY_TOKEN", "test-gateway-token");
  }

  describe("requireEnv", () => {
    it("throws when required env var is missing", async () => {
      // Don't set DISCORD_BOT_TOKEN
      vi.stubEnv("DISCORD_GUILD_ID", "test");
      vi.stubEnv("VOICE_LOG_CHANNEL_ID", "test");
      vi.stubEnv("OPENAI_API_KEY", "test");
      vi.stubEnv("OPENCLAW_GATEWAY_URL", "test");
      vi.stubEnv("OPENCLAW_GATEWAY_TOKEN", "test");

      await expect(import("../../src/config.js")).rejects.toThrow(
        "Missing required env var: DISCORD_BOT_TOKEN",
      );
    });

    it("throws with distinct message when env var is empty", async () => {
      vi.stubEnv("DISCORD_BOT_TOKEN", "");
      vi.stubEnv("DISCORD_GUILD_ID", "test");
      vi.stubEnv("VOICE_LOG_CHANNEL_ID", "test");
      vi.stubEnv("OPENAI_API_KEY", "test");
      vi.stubEnv("OPENCLAW_GATEWAY_URL", "test");
      vi.stubEnv("OPENCLAW_GATEWAY_TOKEN", "test");

      await expect(import("../../src/config.js")).rejects.toThrow(
        "Env var DISCORD_BOT_TOKEN is set but empty",
      );
    });

    it("returns the value when env var is set", async () => {
      setRequiredEnvs();
      const { config } = await import("../../src/config.js");
      expect(config.discordBotToken).toBe("test-token");
      expect(config.discordGuildId).toBe("test-guild");
    });
  });

  describe("optional env vars with defaults", () => {
    it("uses default for OPENCLAW_AGENT_ID", async () => {
      setRequiredEnvs();
      const { config } = await import("../../src/config.js");
      expect(config.openclawAgentId).toBe("main");
    });

    it("uses provided OPENCLAW_AGENT_ID", async () => {
      setRequiredEnvs();
      vi.stubEnv("OPENCLAW_AGENT_ID", "custom-agent");
      const { config } = await import("../../src/config.js");
      expect(config.openclawAgentId).toBe("custom-agent");
    });

    it("uses default for TTS_VOICE", async () => {
      setRequiredEnvs();
      const { config } = await import("../../src/config.js");
      expect(config.ttsVoice).toBe("nova");
    });

    it("uses provided TTS_VOICE", async () => {
      setRequiredEnvs();
      vi.stubEnv("TTS_VOICE", "echo");
      const { config } = await import("../../src/config.js");
      expect(config.ttsVoice).toBe("echo");
    });
  });

  describe("SILENCE_THRESHOLD_MS", () => {
    it("defaults to 1500", async () => {
      setRequiredEnvs();
      const { config } = await import("../../src/config.js");
      expect(config.silenceMs).toBe(1500);
    });

    it("parses custom value", async () => {
      setRequiredEnvs();
      vi.stubEnv("SILENCE_THRESHOLD_MS", "3000");
      const { config } = await import("../../src/config.js");
      expect(config.silenceMs).toBe(3000);
    });

    it("throws on NaN value", async () => {
      setRequiredEnvs();
      vi.stubEnv("SILENCE_THRESHOLD_MS", "not-a-number");
      await expect(import("../../src/config.js")).rejects.toThrow(
        "SILENCE_THRESHOLD_MS must be a positive number",
      );
    });

    it("throws on negative value", async () => {
      setRequiredEnvs();
      vi.stubEnv("SILENCE_THRESHOLD_MS", "-100");
      await expect(import("../../src/config.js")).rejects.toThrow(
        "SILENCE_THRESHOLD_MS must be a positive number",
      );
    });
  });

  describe("static config values", () => {
    it("has expected defaults", async () => {
      setRequiredEnvs();
      const { config } = await import("../../src/config.js");
      expect(config.sampleRate).toBe(48_000);
      expect(config.channels).toBe(2);
      expect(config.apiTimeoutMs).toBe(30_000);
      expect(config.maxHistory).toBe(60);
    });
  });
});
