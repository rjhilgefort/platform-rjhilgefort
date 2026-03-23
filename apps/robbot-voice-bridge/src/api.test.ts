import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./config.js", () => ({
  config: {
    openaiApiKey: "test-openai-key",
    openclawGatewayUrl: "https://openclaw.test",
    openclawGatewayToken: "test-gateway-token",
    openclawAgentId: "test-agent",
    voiceLogChannelId: "test-channel",
    ttsVoice: "nova",
    apiTimeoutMs: 30_000,
  },
}));

vi.mock("./audio.js", () => ({
  saveTtsToFile: vi.fn().mockResolvedValue("/tmp/test-tts.mp3"),
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

import { transcribe, askOpenClaw, generateTTS } from "./api.js";
import { saveTtsToFile } from "./audio.js";

beforeEach(() => {
  fetchMock.mockReset();
});

describe("transcribe", () => {
  it("sends correct request and returns text", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ text: "Hello world" }),
    });

    const result = await transcribe(Buffer.from("fake-wav"));
    expect(result).toBe("Hello world");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.openai.com/v1/audio/transcriptions");
    expect(opts.method).toBe("POST");

    const headers = opts.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-openai-key");

    // body is FormData
    const body = opts.body as FormData;
    expect(body.get("model")).toBe("whisper-1");
    expect(body.get("language")).toBe("en");
  });

  it("filters hallucinations and returns empty string", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ text: "Thank you." }),
    });

    const result = await transcribe(Buffer.from("fake-wav"));
    expect(result).toBe("");
  });

  it("trims whitespace from response", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ text: "  hello  " }),
    });

    const result = await transcribe(Buffer.from("fake-wav"));
    expect(result).toBe("hello");
  });

  it("returns empty string when text is missing", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const result = await transcribe(Buffer.from("fake-wav"));
    expect(result).toBe("");
  });

  it("throws on non-ok response", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve("Rate limited"),
    });

    await expect(transcribe(Buffer.from("x"))).rejects.toThrow(
      "Whisper 429: Rate limited",
    );
  });

  it("passes abort signal for timeout", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ text: "ok" }),
    });

    await transcribe(Buffer.from("x"));
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(opts.signal).toBeInstanceOf(AbortSignal);
  });
});

describe("askOpenClaw", () => {
  it("sends correct headers and body", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: "Bot reply" } }],
        }),
    });

    const history = [
      { role: "user" as const, content: "prev question" },
      { role: "assistant" as const, content: "prev answer" },
    ];
    const result = await askOpenClaw("new question", history);
    expect(result).toBe("Bot reply");

    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://openclaw.test/v1/chat/completions");

    const headers = opts.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-gateway-token");
    expect(headers["x-openclaw-agent-id"]).toBe("test-agent");
    expect(headers["x-openclaw-session-key"]).toBe(
      "agent:test-agent:discord:channel:test-channel",
    );

    const body = JSON.parse(opts.body as string);
    expect(body.model).toBe("openclaw");
    expect(body.messages).toHaveLength(3);
    expect(body.messages[2]).toEqual({ role: "user", content: "new question" });
  });

  it("returns empty string when content is missing", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: {} }],
        }),
    });

    const result = await askOpenClaw("test", []);
    expect(result).toBe("");
  });

  it("returns empty string when choices array is empty", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [] }),
    });

    const result = await askOpenClaw("test", []);
    expect(result).toBe("");
  });

  it("throws on non-ok response", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Internal error"),
    });

    await expect(askOpenClaw("test", [])).rejects.toThrow(
      "OpenClaw 500: Internal error",
    );
  });
});

describe("generateTTS", () => {
  it("sends correct body and returns file path", async () => {
    const fakeArrayBuffer = new ArrayBuffer(8);
    fetchMock.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(fakeArrayBuffer),
    });

    const result = await generateTTS("Hello there");
    expect(result).toBe("/tmp/test-tts.mp3");
    expect(saveTtsToFile).toHaveBeenCalledWith(fakeArrayBuffer);

    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.openai.com/v1/audio/speech");

    const headers = opts.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-openai-key");
    expect(headers["Content-Type"]).toBe("application/json");

    const body = JSON.parse(opts.body as string);
    expect(body.model).toBe("tts-1");
    expect(body.voice).toBe("nova");
    expect(body.input).toBe("Hello there");
    expect(body.response_format).toBe("mp3");
  });

  it("truncates input to 4096 characters", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    });

    const longText = "x".repeat(5000);
    await generateTTS(longText);

    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(opts.body as string);
    expect(body.input.length).toBe(4096);
  });

  it("throws on non-ok response", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("Bad request"),
    });

    await expect(generateTTS("test")).rejects.toThrow(
      "TTS 400: Bad request",
    );
  });
});
