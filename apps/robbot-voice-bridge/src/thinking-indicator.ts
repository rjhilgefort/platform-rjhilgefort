import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import type { AudioPlayer } from "@discordjs/voice";
import { config } from "./config.js";

const THINKING_SOUND_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets",
  "thinking-taps.ogg",
);

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
    playLoop(audioPlayer);
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

/** Exposed for testing only. */
export function isThinking(): boolean {
  return active;
}
