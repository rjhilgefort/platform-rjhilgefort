import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./config.js", () => ({
  config: {
    openclawGatewayUrl: "https://openclaw.test",
    openclawGatewayToken: "test-gateway-token",
    openclawAgentId: "test-agent",
    voiceLogChannelId: "test-channel",
    apiTimeoutMs: 30_000,
  },
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

import { parseSSEChunk, splitSentences, streamOpenClaw } from "./streaming.js";

beforeEach(() => {
  fetchMock.mockReset();
});

describe("parseSSEChunk", () => {
  it("extracts content deltas from SSE lines", () => {
    const chunk = [
      'data: {"choices":[{"delta":{"content":"Hello"}}]}',
      'data: {"choices":[{"delta":{"content":" world"}}]}',
      "",
    ].join("\n");

    expect(parseSSEChunk(chunk)).toEqual(["Hello", " world"]);
  });

  it("ignores [DONE] marker", () => {
    const chunk = [
      'data: {"choices":[{"delta":{"content":"end"}}]}',
      "data: [DONE]",
    ].join("\n");

    expect(parseSSEChunk(chunk)).toEqual(["end"]);
  });

  it("skips lines without data: prefix", () => {
    const chunk = [
      ": comment",
      'data: {"choices":[{"delta":{"content":"hi"}}]}',
      "event: ping",
      "",
    ].join("\n");

    expect(parseSSEChunk(chunk)).toEqual(["hi"]);
  });

  it("skips malformed JSON", () => {
    const chunk = [
      "data: not-json",
      'data: {"choices":[{"delta":{"content":"ok"}}]}',
    ].join("\n");

    expect(parseSSEChunk(chunk)).toEqual(["ok"]);
  });

  it("skips deltas without content", () => {
    const chunk = [
      'data: {"choices":[{"delta":{"role":"assistant"}}]}',
      'data: {"choices":[{"delta":{"content":"hi"}}]}',
    ].join("\n");

    expect(parseSSEChunk(chunk)).toEqual(["hi"]);
  });

  it("handles empty choices array", () => {
    const chunk = 'data: {"choices":[]}';
    expect(parseSSEChunk(chunk)).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(parseSSEChunk("")).toEqual([]);
  });
});

describe("splitSentences", () => {
  it("splits on period followed by space", () => {
    const [sentences, remaining] = splitSentences("Hello world. How are you? ");
    expect(sentences).toEqual(["Hello world.", "How are you?"]);
    expect(remaining).toBe("");
  });

  it("splits on exclamation mark", () => {
    const [sentences, remaining] = splitSentences("Wow! That is great. ");
    expect(sentences).toEqual(["Wow!", "That is great."]);
    expect(remaining).toBe("");
  });

  it("splits on question mark", () => {
    const [sentences, remaining] = splitSentences("What? Really? ");
    expect(sentences).toEqual(["What?", "Really?"]);
    expect(remaining).toBe("");
  });

  it("keeps incomplete sentence in buffer", () => {
    const [sentences, remaining] = splitSentences(
      "First sentence. Second is not done yet",
    );
    expect(sentences).toEqual(["First sentence."]);
    expect(remaining).toBe("Second is not done yet");
  });

  it("does not split on decimal numbers", () => {
    const [sentences, remaining] = splitSentences(
      "The value is 3.14 meters. Done. ",
    );
    expect(sentences).toEqual(["The value is 3.14 meters.", "Done."]);
    expect(remaining).toBe("");
  });

  it("does not split on abbreviations like Mr.", () => {
    const [sentences, remaining] = splitSentences(
      "Mr. Smith went home. ",
    );
    expect(sentences).toEqual(["Mr. Smith went home."]);
    expect(remaining).toBe("");
  });

  it("does not split on Dr.", () => {
    const [sentences, remaining] = splitSentences(
      "Dr. Jones arrived. ",
    );
    expect(sentences).toEqual(["Dr. Jones arrived."]);
    expect(remaining).toBe("");
  });

  it("does not split on ellipsis", () => {
    const [sentences, remaining] = splitSentences(
      "Well... I think so. ",
    );
    expect(sentences).toEqual(["Well... I think so."]);
    expect(remaining).toBe("");
  });

  it("does not split on U.S.", () => {
    const [sentences, remaining] = splitSentences(
      "The U.S. economy grew. ",
    );
    expect(sentences).toEqual(["The U.S. economy grew."]);
    expect(remaining).toBe("");
  });

  it("does not split on URLs", () => {
    const [sentences, remaining] = splitSentences(
      "Visit example.com for more. ",
    );
    expect(sentences).toEqual(["Visit example.com for more."]);
    expect(remaining).toBe("");
  });

  it("handles period at end of string (no trailing space)", () => {
    const [sentences, remaining] = splitSentences("Hello world.");
    expect(sentences).toEqual(["Hello world."]);
    expect(remaining).toBe("");
  });

  it("returns empty for empty string", () => {
    const [sentences, remaining] = splitSentences("");
    expect(sentences).toEqual([]);
    expect(remaining).toBe("");
  });

  it("handles multiple abbreviations", () => {
    const [sentences, remaining] = splitSentences(
      "Dr. Smith met Prof. Jones at St. Mary's. They talked. ",
    );
    expect(sentences).toEqual([
      "Dr. Smith met Prof. Jones at St. Mary's.",
      "They talked.",
    ]);
    expect(remaining).toBe("");
  });
});

describe("streamOpenClaw", () => {
  function makeSSEStream(chunks: Array<string>): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();
    let index = 0;
    return new ReadableStream({
      pull(controller) {
        if (index < chunks.length) {
          controller.enqueue(encoder.encode(chunks[index]));
          index++;
        } else {
          controller.close();
        }
      },
    });
  }

  it("yields sentences from streamed SSE", async () => {
    const sseChunks = [
      'data: {"choices":[{"delta":{"content":"Hello there. "}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"How are you doing today? "}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"I am fine."}}]}\n\n',
      "data: [DONE]\n\n",
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      body: makeSSEStream(sseChunks),
    });

    const chunks: Array<{ text: string; index: number; isFinal: boolean }> = [];
    const gen = streamOpenClaw("test", []);

    for (;;) {
      const { value, done } = await gen.next();
      if (done) break;
      chunks.push(value);
    }

    expect(chunks.length).toBeGreaterThanOrEqual(1);
    const allText = chunks.map((c) => c.text).join(" ");
    expect(allText).toContain("Hello there.");
  });

  it("sends correct request with stream: true", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      body: makeSSEStream(["data: [DONE]\n\n"]),
    });

    const gen = streamOpenClaw("question", [
      { role: "user", content: "prev" },
    ]);
    // Drain the generator
    for (;;) {
      const { done } = await gen.next();
      if (done) break;
    }

    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://openclaw.test/v1/chat/completions");

    const headers = opts.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-gateway-token");
    expect(headers["x-openclaw-agent-id"]).toBe("test-agent");

    const body = JSON.parse(opts.body as string);
    expect(body.stream).toBe(true);
    expect(body.messages).toHaveLength(2);
  });

  it("throws on non-ok response", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Server error"),
    });

    const gen = streamOpenClaw("test", []);
    await expect(gen.next()).rejects.toThrow("OpenClaw 500: Server error");
  });

  it("throws when response body is null", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      body: null,
    });

    const gen = streamOpenClaw("test", []);
    await expect(gen.next()).rejects.toThrow("OpenClaw response has no body");
  });

  it("returns fullText in generator return value", async () => {
    const sseChunks = [
      'data: {"choices":[{"delta":{"content":"Done."}}]}\n\n',
      "data: [DONE]\n\n",
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      body: makeSSEStream(sseChunks),
    });

    const gen = streamOpenClaw("test", []);
    let result: { fullText: string } | undefined;

    for (;;) {
      const { value, done } = await gen.next();
      if (done) {
        result = value;
        break;
      }
    }

    expect(result?.fullText).toBe("Done.");
  });

  it("flushes remaining buffer as final chunk", async () => {
    const sseChunks = [
      'data: {"choices":[{"delta":{"content":"Short ending text"}}]}\n\n',
      "data: [DONE]\n\n",
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      body: makeSSEStream(sseChunks),
    });

    const chunks: Array<{ text: string; isFinal: boolean }> = [];
    const gen = streamOpenClaw("test", []);

    for (;;) {
      const { value, done } = await gen.next();
      if (done) break;
      chunks.push(value);
    }

    // The remaining buffer should be flushed as isFinal: true
    const finalChunk = chunks[chunks.length - 1];
    expect(finalChunk?.isFinal).toBe(true);
  });
});
