import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Client, Guild, GuildMember, GuildMemberManager } from "discord.js";
import type { VoiceState, SentenceChunk } from "./types.js";

vi.mock("./config.js", () => ({
  config: {
    sampleRate: 48_000,
    channels: 2,
    maxHistory: 4,
    discordGuildId: "test-guild",
    interruptEnabled: true,
    interruptMinDurationMs: 300,
  },
}));

const mockTranscribe = vi.fn();
const mockAskOpenClaw = vi.fn();
const mockGenerateTTS = vi.fn();
const mockGenerateTTSStream = vi.fn();
vi.mock("./api.js", () => ({
  transcribe: (...args: Array<unknown>) => mockTranscribe(...args),
  askOpenClaw: (...args: Array<unknown>) => mockAskOpenClaw(...args),
  generateTTS: (...args: Array<unknown>) => mockGenerateTTS(...args),
  generateTTSStream: (...args: Array<unknown>) => mockGenerateTTSStream(...args),
}));

const mockStreamOpenClaw = vi.fn();
vi.mock("./streaming.js", () => ({
  streamOpenClaw: (...args: Array<unknown>) => mockStreamOpenClaw(...args),
}));

const mockPcmToWav = vi.fn().mockReturnValue(Buffer.from("wav-data"));
const mockPlayAudio = vi.fn().mockResolvedValue(undefined);
const mockPlayAudioStream = vi.fn().mockResolvedValue(undefined);

vi.mock("./audio.js", () => {
  class MockAudioQueue {
    enqueue(fn: () => Promise<void>): void {
      void fn();
    }
    async waitForAll(): Promise<void> {}
    interrupt(): void {}
  }

  return {
    pcmToWav: (...args: Array<unknown>) => mockPcmToWav(...args),
    playAudio: (...args: Array<unknown>) => mockPlayAudio(...args),
    playAudioStream: (...args: Array<unknown>) => mockPlayAudioStream(...args),
    AudioQueue: MockAudioQueue,
  };
});

import { handleSpeech, interruptPipeline } from "./pipeline.js";

function makeState(overrides: Partial<VoiceState> = {}): VoiceState {
  return {
    voiceConnection: null,
    audioPlayer: null,
    logChannel: null,
    isProcessing: false,
    conversationHistory: [],
    abortController: null,
    activeAudioQueue: null,
    isInterrupting: false,
    ...overrides,
  };
}

// 48000 Hz * 2 channels * 2 bytes = 192000 bytes/sec
const BYTES_PER_SEC = 48_000 * 2 * 2;

function makePcmChunks(durationSec: number): Array<Buffer> {
  return [Buffer.alloc(Math.floor(BYTES_PER_SEC * durationSec))];
}

function makeClient(memberName?: string): Client<true> {
  const member = memberName
    ? ({ displayName: memberName } as GuildMember)
    : undefined;

  const memberManager = {
    fetch: vi.fn().mockResolvedValue(member ?? null),
  } as unknown as GuildMemberManager;

  const guild = {
    members: memberManager,
  } as unknown as Guild;

  const cache = new Map<string, Guild>();
  cache.set("test-guild", guild);

  return {
    guilds: { cache },
  } as unknown as Client<true>;
}

/**
 * Create a mock async generator that yields sentences then returns fullText.
 */
function makeMockStreamGenerator(
  sentences: Array<string>,
  fullText: string,
): AsyncGenerator<SentenceChunk, { fullText: string }> {
  let index = 0;
  return {
    [Symbol.asyncIterator]() { return this; },
    async next() {
      if (index < sentences.length) {
        const text = sentences[index] ?? "";
        const chunk: SentenceChunk = {
          text,
          index,
          isFinal: index === sentences.length - 1,
        };
        index++;
        return { value: chunk, done: false as const };
      }
      return { value: { fullText }, done: true as const };
    },
    async return(value: { fullText: string }) {
      return { value, done: true as const };
    },
    async throw(err: Error) {
      throw err;
    },
  };
}

/** Mock ReadableStream to satisfy generateTTSStream return type */
function makeMockTTSStream(): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.close();
    },
  });
}

beforeEach(() => {
  mockTranscribe.mockReset();
  mockAskOpenClaw.mockReset();
  mockGenerateTTS.mockReset();
  mockGenerateTTSStream.mockReset();
  mockStreamOpenClaw.mockReset();
  mockPcmToWav.mockReset().mockReturnValue(Buffer.from("wav-data"));
  mockPlayAudio.mockReset().mockResolvedValue(undefined);
  mockPlayAudioStream.mockReset().mockResolvedValue(undefined);
});

describe("handleSpeech", () => {
  it("completes streaming pipeline flow", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");
    mockStreamOpenClaw.mockReturnValue(
      makeMockStreamGenerator(["Hello human.", "How are you?"], "Hello human. How are you?"),
    );
    mockGenerateTTSStream.mockResolvedValue(makeMockTTSStream());

    const state = makeState();
    await handleSpeech(makeClient("TestUser"), state, "user-123", makePcmChunks(1));

    expect(mockPcmToWav).toHaveBeenCalledOnce();
    expect(mockTranscribe).toHaveBeenCalledOnce();
    expect(mockStreamOpenClaw.mock.calls[0]?.[0]).toBe("Hello bot");
    expect(mockGenerateTTSStream).toHaveBeenCalledTimes(2);
    expect(mockGenerateTTSStream).toHaveBeenCalledWith("Hello human.");
    expect(mockGenerateTTSStream).toHaveBeenCalledWith("How are you?");
  });

  it("skips audio shorter than 0.5s", async () => {
    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(0.3));

    expect(mockTranscribe).not.toHaveBeenCalled();
    expect(state.isProcessing).toBe(false);
  });

  it("drops utterance when isProcessing is true", async () => {
    const state = makeState({ isProcessing: true });
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(mockTranscribe).not.toHaveBeenCalled();
    expect(state.isProcessing).toBe(true);
  });

  it("handles empty transcription", async () => {
    mockTranscribe.mockResolvedValue("");

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(mockStreamOpenClaw).not.toHaveBeenCalled();
    expect(state.isProcessing).toBe(false);
  });

  it("handles single-char transcription as empty", async () => {
    mockTranscribe.mockResolvedValue("a");

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(mockStreamOpenClaw).not.toHaveBeenCalled();
    expect(state.isProcessing).toBe(false);
  });

  it("handles empty LLM response from stream", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");
    mockStreamOpenClaw.mockReturnValue(
      makeMockStreamGenerator([], ""),
    );

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(mockGenerateTTSStream).not.toHaveBeenCalled();
    expect(state.conversationHistory).toHaveLength(0);
    expect(state.isProcessing).toBe(false);
  });

  it("updates conversation history correctly", async () => {
    mockTranscribe.mockResolvedValue("Hello");
    mockStreamOpenClaw.mockReturnValue(
      makeMockStreamGenerator(["Hi there."], "Hi there."),
    );
    mockGenerateTTSStream.mockResolvedValue(makeMockTTSStream());

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(state.conversationHistory).toEqual([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there." },
    ]);
  });

  it("trims history at maxHistory (4)", async () => {
    mockTranscribe.mockResolvedValue("msg");
    mockStreamOpenClaw.mockReturnValue(
      makeMockStreamGenerator(["reply."], "reply."),
    );
    mockGenerateTTSStream.mockResolvedValue(makeMockTTSStream());

    const state = makeState({
      conversationHistory: [
        { role: "user", content: "old1" },
        { role: "assistant", content: "old2" },
        { role: "user", content: "old3" },
        { role: "assistant", content: "old4" },
      ],
    });

    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(state.conversationHistory).toHaveLength(4);
    expect(state.conversationHistory[0]).toEqual({
      role: "user",
      content: "old3",
    });
    expect(state.conversationHistory[3]).toEqual({
      role: "assistant",
      content: "reply.",
    });
  });

  it("resets isProcessing on success", async () => {
    mockTranscribe.mockResolvedValue("Hello");
    mockStreamOpenClaw.mockReturnValue(
      makeMockStreamGenerator(["Hi."], "Hi."),
    );
    mockGenerateTTSStream.mockResolvedValue(makeMockTTSStream());

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(state.isProcessing).toBe(false);
  });

  it("resets isProcessing on error", async () => {
    mockTranscribe.mockRejectedValue(new Error("network fail"));

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(state.isProcessing).toBe(false);
  });

  it("falls back to non-streaming on stream error", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");
    mockStreamOpenClaw.mockReturnValue({
      [Symbol.asyncIterator]() { return this; },
      async next(): Promise<IteratorResult<SentenceChunk, { fullText: string }>> {
        throw new Error("stream broke");
      },
      async return(value: { fullText: string }) {
        return { value, done: true };
      },
      async throw(err: Error) { throw err; },
    });
    mockAskOpenClaw.mockResolvedValue("Fallback reply");
    mockGenerateTTS.mockResolvedValue("/tmp/fallback.mp3");

    const state = makeState();
    await handleSpeech(makeClient("Alice"), state, "user-123", makePcmChunks(1));

    expect(mockAskOpenClaw).toHaveBeenCalledOnce();
    expect(mockGenerateTTS).toHaveBeenCalledWith("Fallback reply");
    expect(mockPlayAudio).toHaveBeenCalledWith("/tmp/fallback.mp3", null);
    expect(state.conversationHistory).toEqual([
      { role: "user", content: "Hello bot" },
      { role: "assistant", content: "Fallback reply" },
    ]);
  });

  it("logs exchange to channel", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");
    mockStreamOpenClaw.mockReturnValue(
      makeMockStreamGenerator(["Hello human."], "Hello human."),
    );
    mockGenerateTTSStream.mockResolvedValue(makeMockTTSStream());

    const sendMock = vi.fn().mockResolvedValue(undefined);
    const logChannel = { send: sendMock } as unknown as VoiceState["logChannel"];

    const state = makeState({ logChannel });
    await handleSpeech(makeClient("Alice"), state, "user-123", makePcmChunks(1));

    expect(sendMock).toHaveBeenCalledOnce();
    const msg = sendMock.mock.calls[0]?.[0] as string;
    expect(msg).toContain("Alice");
    expect(msg).toContain("Hello bot");
    expect(msg).toContain("Hello human.");
  });

  it("does not log when logChannel is null", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");
    mockStreamOpenClaw.mockReturnValue(
      makeMockStreamGenerator(["Hello human."], "Hello human."),
    );
    mockGenerateTTSStream.mockResolvedValue(makeMockTTSStream());

    const state = makeState({ logChannel: null });
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(state.isProcessing).toBe(false);
  });

  it("sets abortController on state during processing", async () => {
    let capturedController: AbortController | null = null;
    mockTranscribe.mockImplementation(() => {
      capturedController = state.abortController;
      return Promise.resolve("Hello");
    });
    mockStreamOpenClaw.mockReturnValue(
      makeMockStreamGenerator(["Hi."], "Hi."),
    );
    mockGenerateTTSStream.mockResolvedValue(makeMockTTSStream());

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(capturedController).toBeInstanceOf(AbortController);
    // Cleaned up after completion
    expect(state.abortController).toBeNull();
    expect(state.activeAudioQueue).toBeNull();
  });

  it("handles abort gracefully during stream", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");

    // Generator that throws AbortError on second call
    const abortGen = {
      callCount: 0,
      [Symbol.asyncIterator]() { return this; },
      async next(): Promise<IteratorResult<SentenceChunk, { fullText: string }>> {
        abortGen.callCount++;
        if (abortGen.callCount === 1) {
          return {
            value: { text: "Partial response.", index: 0, isFinal: false },
            done: false as const,
          };
        }
        const err = new DOMException("The operation was aborted", "AbortError");
        throw err;
      },
      async return(value: { fullText: string }) {
        return { value, done: true as const };
      },
      async throw(err: Error) { throw err; },
    };
    mockStreamOpenClaw.mockReturnValue(abortGen);
    mockGenerateTTSStream.mockResolvedValue(makeMockTTSStream());

    const state = makeState();
    // Simulate: pipeline starts, then abort is triggered mid-stream
    const speechPromise = handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));
    // The abort happens inside the generator mock
    // We need to manually abort after transcribe
    queueMicrotask(() => {
      state.abortController?.abort();
    });
    await speechPromise;

    expect(state.isProcessing).toBe(false);
    expect(state.abortController).toBeNull();
  });
});

describe("interruptPipeline", () => {
  it("aborts controller, interrupts queue, stops player, resets state", () => {
    const abortController = new AbortController();
    const mockInterrupt = vi.fn();
    const mockStop = vi.fn();

    const state = makeState({
      isProcessing: true,
      abortController,
      activeAudioQueue: { interrupt: mockInterrupt, enqueue: vi.fn(), waitForAll: vi.fn() } as unknown as VoiceState["activeAudioQueue"],
      audioPlayer: { stop: mockStop } as unknown as VoiceState["audioPlayer"],
    });

    interruptPipeline(state);

    expect(abortController.signal.aborted).toBe(true);
    expect(mockInterrupt).toHaveBeenCalledOnce();
    expect(mockStop).toHaveBeenCalledOnce();
    expect(state.isProcessing).toBe(false);
    expect(state.abortController).toBeNull();
    expect(state.activeAudioQueue).toBeNull();
  });

  it("guards against re-entrant interrupts", () => {
    const state = makeState({
      isProcessing: true,
      isInterrupting: true,
    });

    interruptPipeline(state);

    // isProcessing unchanged because guard returned early
    expect(state.isProcessing).toBe(true);
  });

  it("handles null controller and queue gracefully", () => {
    const state = makeState({
      isProcessing: true,
      abortController: null,
      activeAudioQueue: null,
    });

    expect(() => interruptPipeline(state)).not.toThrow();
    expect(state.isProcessing).toBe(false);
  });
});
