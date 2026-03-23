import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import type { AudioPlayer } from "@discordjs/voice";
import { config } from "./config.js";

const ASSETS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
const THINKING_SOUND_PATH = join(ASSETS_DIR, "ding.ogg");
const DING_SOUND_PATH = join(ASSETS_DIR, "ding.ogg");

let active = false;
let cleanupListener: (() => void) | null = null;

/**
 * Start looping the thinking indicator sound on the given audio player.
 * Playing any other resource on the same player will stop it automatically;
 * call stopThinking() to explicitly end the loop.
 */
export function startThinking(audioPlayer: AudioPlayer | null): void {
  if (!config.thinkingIndicatorEnabled || !audioPlayer || active) return;
  active = true;
  playLoop(audioPlayer);
}

function playLoop(audioPlayer: AudioPlayer): void {
  if (!active) return;

  const resource = createAudioResource(THINKING_SOUND_PATH);
  audioPlayer.play(resource);

  const onIdle = () => {
    audioPlayer.off(AudioPlayerStatus.Idle, onIdle);
    cleanupListener = null;
    // Wait before repeating so it's not too frequent
    const timer = setTimeout(() => {
      if (active) playLoop(audioPlayer);
    }, 5_000); // ~7s total (2s clip + 5s pause)
    // Store timer cleanup in case stopThinking is called during the pause
    cleanupListener = () => clearTimeout(timer);
  };

  cleanupListener = () => {
    audioPlayer.off(AudioPlayerStatus.Idle, onIdle);
  };
  audioPlayer.on(AudioPlayerStatus.Idle, onIdle);
}

/**
 * Stop the thinking indicator loop. Safe to call even if not active.
 */
export function stopThinking(): void {
  if (!active) return;
  active = false;
  cleanupListener?.();
  cleanupListener = null;
}

/**
 * Play a short ding sound as acknowledgment. Returns a promise that resolves
 * when the ding finishes playing.
 */
export function playDing(audioPlayer: AudioPlayer | null): Promise<void> {
  if (!audioPlayer) return Promise.resolve();
  const resource = createAudioResource(DING_SOUND_PATH);
  audioPlayer.play(resource);
  return new Promise((resolve) => {
    const onIdle = () => {
      audioPlayer.off(AudioPlayerStatus.Idle, onIdle);
      resolve();
    };
    audioPlayer.once(AudioPlayerStatus.Idle, onIdle);
    setTimeout(() => {
      audioPlayer.off(AudioPlayerStatus.Idle, onIdle);
      resolve();
    }, 3_000);
  });
}

/** Exposed for testing only. */
export function isThinking(): boolean {
  return active;
}
