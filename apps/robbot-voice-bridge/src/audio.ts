import { unlinkSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import {
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
} from "@discordjs/voice";
import type { AudioPlayer } from "@discordjs/voice";

export function pcmToWav(
  pcmBuffer: Buffer,
  sampleRate: number,
  channels: number,
): Buffer {
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]);
}

export async function saveTtsToFile(arrayBuffer: ArrayBuffer): Promise<string> {
  const mp3Path = join(tmpdir(), `robbot-tts-${randomUUID()}.mp3`);
  await writeFile(mp3Path, Buffer.from(arrayBuffer));
  return mp3Path;
}

export function playAudio(
  filePath: string,
  audioPlayer: AudioPlayer | null,
): Promise<void> {
  if (!audioPlayer) return Promise.resolve();
  const resource = createAudioResource(filePath);
  audioPlayer.play(resource);
  return new Promise((resolve) => {
    const cleanup = () => {
      clearTimeout(timer);
      audioPlayer.off(AudioPlayerStatus.Idle, cleanup);
      try {
        unlinkSync(filePath);
      } catch {
        // file already cleaned up
      }
      resolve();
    };
    audioPlayer.once(AudioPlayerStatus.Idle, cleanup);
    const timer = setTimeout(cleanup, 60_000);
  });
}

/**
 * Play an Opus audio stream directly to the Discord audio player.
 * The stream is piped into createAudioResource with OggOpus type.
 */
export function playAudioStream(
  stream: ReadableStream<Uint8Array>,
  audioPlayer: AudioPlayer | null,
): Promise<void> {
  if (!audioPlayer) return Promise.resolve();

  // Cast needed: web ReadableStream vs node ReadableStream have minor type differences
  const nodeStream = Readable.fromWeb(
    stream as import("node:stream/web").ReadableStream,
  );
  const resource = createAudioResource(nodeStream, {
    inputType: StreamType.OggOpus,
  });
  audioPlayer.play(resource);

  return new Promise<void>((resolve, reject) => {
    const done = () => {
      clearTimeout(timer);
      audioPlayer.off(AudioPlayerStatus.Idle, done);
      nodeStream.destroy();
      resolve();
    };
    nodeStream.on("error", (err) => {
      clearTimeout(timer);
      audioPlayer.off(AudioPlayerStatus.Idle, done);
      nodeStream.destroy();
      reject(err);
    });
    audioPlayer.once(AudioPlayerStatus.Idle, done);
    const timer = setTimeout(done, 60_000);
  });
}

/**
 * Sequential audio queue — enqueue playback promises that execute one at a time.
 */
export class AudioQueue {
  private queue: Array<() => Promise<void>> = [];
  private drainPromise: Promise<void> | null = null;
  private interrupted = false;

  enqueue(play: () => Promise<void>): void {
    if (this.interrupted) return;
    this.queue.push(play);
    if (!this.drainPromise) {
      this.drainPromise = this.drain();
    }
  }

  private async drain(): Promise<void> {
    while (this.queue.length > 0 && !this.interrupted) {
      const next = this.queue.shift();
      if (next) {
        try {
          await next();
        } catch (err) {
          if (this.interrupted) break;
          console.warn("[audio-queue] Playback failed, skipping:", err instanceof Error ? err.message : err);
        }
      }
    }
    this.drainPromise = null;
  }

  /** Clear the queue and stop processing. */
  interrupt(): void {
    this.interrupted = true;
    this.queue.length = 0;
  }

  /** Resolves when all enqueued items have finished playing. */
  async waitForAll(): Promise<void> {
    if (this.drainPromise) await this.drainPromise;
  }
}
