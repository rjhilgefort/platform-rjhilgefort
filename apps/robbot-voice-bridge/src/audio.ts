import { unlinkSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  createAudioResource,
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
      try {
        unlinkSync(filePath);
      } catch {
        // file already cleaned up
      }
      resolve();
    };
    audioPlayer.once(AudioPlayerStatus.Idle, cleanup);
    setTimeout(cleanup, 60_000);
  });
}
