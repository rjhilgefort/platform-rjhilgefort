import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Client, Guild, GuildMember, GuildMemberManager, Collection } from "discord.js";
import type { VoiceState } from "../../src/types.js";

vi.mock("../../src/config.js", () => ({
  config: {
    sampleRate: 48_000,
    channels: 2,
    maxHistory: 4,
    discordGuildId: "test-guild",
  },
}));

const mockTranscribe = vi.fn();
const mockAskOpenClaw = vi.fn();
const mockGenerateTTS = vi.fn();
vi.mock("../../src/api.js", () => ({
  transcribe: (...args: Array<unknown>) => mockTranscribe(...args),
  askOpenClaw: (...args: Array<unknown>) => mockAskOpenClaw(...args),
  generateTTS: (...args: Array<unknown>) => mockGenerateTTS(...args),
}));

const mockPcmToWav = vi.fn().mockReturnValue(Buffer.from("wav-data"));
const mockPlayAudio = vi.fn().mockResolvedValue(undefined);
vi.mock("../../src/audio.js", () => ({
  pcmToWav: (...args: Array<unknown>) => mockPcmToWav(...args),
  playAudio: (...args: Array<unknown>) => mockPlayAudio(...args),
}));

import { handleSpeech } from "../../src/pipeline.js";

function makeState(overrides: Partial<VoiceState> = {}): VoiceState {
  return {
    voiceConnection: null,
    audioPlayer: null,
    logChannel: null,
    isProcessing: false,
    conversationHistory: [],
    ...overrides,
  };
}

// 48000 Hz * 2 channels * 2 bytes = 192000 bytes/sec
// 1 second of audio = 192000 bytes
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

beforeEach(() => {
  mockTranscribe.mockReset();
  mockAskOpenClaw.mockReset();
  mockGenerateTTS.mockReset();
  mockPcmToWav.mockReset().mockReturnValue(Buffer.from("wav-data"));
  mockPlayAudio.mockReset().mockResolvedValue(undefined);
});

describe("handleSpeech", () => {
  it("completes full pipeline flow", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");
    mockAskOpenClaw.mockResolvedValue("Hello human");
    mockGenerateTTS.mockResolvedValue("/tmp/tts.mp3");

    const state = makeState();
    await handleSpeech(makeClient("TestUser"), state, "user-123", makePcmChunks(1));

    expect(mockPcmToWav).toHaveBeenCalledOnce();
    expect(mockTranscribe).toHaveBeenCalledOnce();
    // history array is passed by reference and mutated after the call,
    // so we verify the first arg (text) and that history was passed
    expect(mockAskOpenClaw.mock.calls[0]?.[0]).toBe("Hello bot");
    expect(mockAskOpenClaw.mock.calls[0]?.[1]).toBe(state.conversationHistory);
    expect(mockGenerateTTS).toHaveBeenCalledWith("Hello human");
    expect(mockPlayAudio).toHaveBeenCalledWith("/tmp/tts.mp3", null);
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
    expect(state.isProcessing).toBe(true); // unchanged
  });

  it("handles empty transcription", async () => {
    mockTranscribe.mockResolvedValue("");

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(mockAskOpenClaw).not.toHaveBeenCalled();
    expect(state.isProcessing).toBe(false);
  });

  it("handles single-char transcription as empty", async () => {
    mockTranscribe.mockResolvedValue("a");

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(mockAskOpenClaw).not.toHaveBeenCalled();
    expect(state.isProcessing).toBe(false);
  });

  it("handles empty LLM response", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");
    mockAskOpenClaw.mockResolvedValue("");

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(mockGenerateTTS).not.toHaveBeenCalled();
    expect(state.conversationHistory).toHaveLength(0);
    expect(state.isProcessing).toBe(false);
  });

  it("updates conversation history correctly", async () => {
    mockTranscribe.mockResolvedValue("Hello");
    mockAskOpenClaw.mockResolvedValue("Hi there");
    mockGenerateTTS.mockResolvedValue("/tmp/tts.mp3");

    const state = makeState();
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    expect(state.conversationHistory).toEqual([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there" },
    ]);
  });

  it("trims history at maxHistory (4)", async () => {
    mockTranscribe.mockResolvedValue("msg");
    mockAskOpenClaw.mockResolvedValue("reply");
    mockGenerateTTS.mockResolvedValue("/tmp/tts.mp3");

    const state = makeState({
      conversationHistory: [
        { role: "user", content: "old1" },
        { role: "assistant", content: "old2" },
        { role: "user", content: "old3" },
        { role: "assistant", content: "old4" },
      ],
    });

    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    // maxHistory=4, so after pushing 2 more (total 6) it shifts until 4
    expect(state.conversationHistory).toHaveLength(4);
    expect(state.conversationHistory[0]).toEqual({
      role: "user",
      content: "old3",
    });
    expect(state.conversationHistory[3]).toEqual({
      role: "assistant",
      content: "reply",
    });
  });

  it("resets isProcessing on success", async () => {
    mockTranscribe.mockResolvedValue("Hello");
    mockAskOpenClaw.mockResolvedValue("Hi");
    mockGenerateTTS.mockResolvedValue("/tmp/tts.mp3");

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

  it("logs exchange to channel", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");
    mockAskOpenClaw.mockResolvedValue("Hello human");
    mockGenerateTTS.mockResolvedValue("/tmp/tts.mp3");

    const sendMock = vi.fn().mockResolvedValue(undefined);
    const logChannel = { send: sendMock } as unknown as VoiceState["logChannel"];

    const state = makeState({ logChannel });
    await handleSpeech(makeClient("Alice"), state, "user-123", makePcmChunks(1));

    expect(sendMock).toHaveBeenCalledOnce();
    const msg = sendMock.mock.calls[0]?.[0] as string;
    expect(msg).toContain("Alice");
    expect(msg).toContain("Hello bot");
    expect(msg).toContain("Hello human");
  });

  it("does not log when logChannel is null", async () => {
    mockTranscribe.mockResolvedValue("Hello bot");
    mockAskOpenClaw.mockResolvedValue("Hello human");
    mockGenerateTTS.mockResolvedValue("/tmp/tts.mp3");

    const state = makeState({ logChannel: null });
    await handleSpeech(makeClient(), state, "user-123", makePcmChunks(1));

    // no error, pipeline completes
    expect(state.isProcessing).toBe(false);
  });
});
