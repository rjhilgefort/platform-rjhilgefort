import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventEmitter } from "node:events";
import { AudioPlayerStatus } from "@discordjs/voice";
import type { AudioPlayer } from "@discordjs/voice";

vi.mock("./config.js", () => ({
  config: {
    thinkingIndicatorEnabled: true,
  },
}));

vi.mock("@discordjs/voice", async () => {
  const actual = await vi.importActual<typeof import("@discordjs/voice")>(
    "@discordjs/voice",
  );
  return {
    ...actual,
    createAudioResource: vi.fn().mockReturnValue({ metadata: null }),
  };
});

import { startThinking, stopThinking, isThinking } from "./thinking-indicator.js";
import { config } from "./config.js";

function makePlayer(): AudioPlayer & EventEmitter {
  const emitter = new EventEmitter();
  const player = Object.assign(emitter, {
    play: vi.fn(),
    stop: vi.fn(),
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    once: emitter.once.bind(emitter),
  });
  return player as unknown as AudioPlayer & EventEmitter;
}

beforeEach(() => {
  stopThinking();
  // Reset the enabled flag (tests may mutate it)
  Object.assign(config, { thinkingIndicatorEnabled: true });
});

describe("thinking-indicator", () => {
  it("starts playing on startThinking", () => {
    const player = makePlayer();
    startThinking(player);

    expect(isThinking()).toBe(true);
    expect(player.play).toHaveBeenCalledOnce();
  });

  it("loops when player goes idle", () => {
    const player = makePlayer();
    startThinking(player);

    expect(player.play).toHaveBeenCalledTimes(1);

    // Simulate clip finishing
    player.emit(AudioPlayerStatus.Idle);
    expect(player.play).toHaveBeenCalledTimes(2);

    player.emit(AudioPlayerStatus.Idle);
    expect(player.play).toHaveBeenCalledTimes(3);
  });

  it("stopThinking ends the loop", () => {
    const player = makePlayer();
    startThinking(player);

    stopThinking();
    expect(isThinking()).toBe(false);

    // Idle after stop should NOT replay
    player.emit(AudioPlayerStatus.Idle);
    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it("does nothing when disabled", () => {
    Object.assign(config, { thinkingIndicatorEnabled: false });
    const player = makePlayer();
    startThinking(player);

    expect(isThinking()).toBe(false);
    expect(player.play).not.toHaveBeenCalled();
  });

  it("does nothing with null player", () => {
    startThinking(null);
    expect(isThinking()).toBe(false);
  });

  it("does not double-start", () => {
    const player = makePlayer();
    startThinking(player);
    startThinking(player);

    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it("stopThinking is safe to call when not active", () => {
    expect(() => stopThinking()).not.toThrow();
    expect(isThinking()).toBe(false);
  });

  it("can restart after stopping", () => {
    const player = makePlayer();
    startThinking(player);
    stopThinking();
    startThinking(player);

    expect(isThinking()).toBe(true);
    expect(player.play).toHaveBeenCalledTimes(2);
  });
});
