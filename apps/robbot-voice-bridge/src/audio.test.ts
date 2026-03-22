import { describe, it, expect } from "vitest";
import { pcmToWav } from "./audio.js";

describe("pcmToWav", () => {
  const sampleRate = 48_000;
  const channels = 2;

  it("produces a 44-byte WAV header + input data", () => {
    const pcm = Buffer.alloc(100, 0xab);
    const wav = pcmToWav(pcm, sampleRate, channels);
    expect(wav.length).toBe(44 + 100);
  });

  it("starts with RIFF marker", () => {
    const wav = pcmToWav(Buffer.alloc(10), sampleRate, channels);
    expect(wav.toString("ascii", 0, 4)).toBe("RIFF");
  });

  it("has correct RIFF chunk size", () => {
    const pcm = Buffer.alloc(256);
    const wav = pcmToWav(pcm, sampleRate, channels);
    expect(wav.readUInt32LE(4)).toBe(36 + 256);
  });

  it("has WAVE format marker at offset 8", () => {
    const wav = pcmToWav(Buffer.alloc(0), sampleRate, channels);
    expect(wav.toString("ascii", 8, 12)).toBe("WAVE");
  });

  it("has fmt subchunk at offset 12", () => {
    const wav = pcmToWav(Buffer.alloc(0), sampleRate, channels);
    expect(wav.toString("ascii", 12, 16)).toBe("fmt ");
    // fmt chunk size = 16
    expect(wav.readUInt32LE(16)).toBe(16);
    // audio format = 1 (PCM)
    expect(wav.readUInt16LE(20)).toBe(1);
  });

  it("encodes channels correctly", () => {
    const mono = pcmToWav(Buffer.alloc(0), sampleRate, 1);
    expect(mono.readUInt16LE(22)).toBe(1);

    const stereo = pcmToWav(Buffer.alloc(0), sampleRate, 2);
    expect(stereo.readUInt16LE(22)).toBe(2);
  });

  it("encodes sample rate correctly", () => {
    const wav16k = pcmToWav(Buffer.alloc(0), 16_000, 1);
    expect(wav16k.readUInt32LE(24)).toBe(16_000);

    const wav48k = pcmToWav(Buffer.alloc(0), 48_000, 2);
    expect(wav48k.readUInt32LE(24)).toBe(48_000);
  });

  it("encodes byte rate correctly", () => {
    // byteRate = sampleRate * channels * 2
    const wav = pcmToWav(Buffer.alloc(0), 48_000, 2);
    expect(wav.readUInt32LE(28)).toBe(48_000 * 2 * 2);
  });

  it("encodes block align correctly", () => {
    // blockAlign = channels * 2
    const mono = pcmToWav(Buffer.alloc(0), 44_100, 1);
    expect(mono.readUInt16LE(32)).toBe(2);

    const stereo = pcmToWav(Buffer.alloc(0), 44_100, 2);
    expect(stereo.readUInt16LE(32)).toBe(4);
  });

  it("has 16 bits per sample", () => {
    const wav = pcmToWav(Buffer.alloc(0), sampleRate, channels);
    expect(wav.readUInt16LE(34)).toBe(16);
  });

  it("has data subchunk at offset 36", () => {
    const pcm = Buffer.alloc(64);
    const wav = pcmToWav(pcm, sampleRate, channels);
    expect(wav.toString("ascii", 36, 40)).toBe("data");
    expect(wav.readUInt32LE(40)).toBe(64);
  });

  it("preserves PCM data after header", () => {
    const pcm = Buffer.from([1, 2, 3, 4, 5]);
    const wav = pcmToWav(pcm, sampleRate, channels);
    expect(wav.subarray(44)).toEqual(pcm);
  });

  it("handles empty buffer", () => {
    const wav = pcmToWav(Buffer.alloc(0), sampleRate, channels);
    expect(wav.length).toBe(44);
    expect(wav.toString("ascii", 0, 4)).toBe("RIFF");
    expect(wav.readUInt32LE(4)).toBe(36);
    expect(wav.readUInt32LE(40)).toBe(0);
  });

  it("works with different sample rates", () => {
    for (const rate of [8_000, 16_000, 22_050, 44_100, 48_000]) {
      const wav = pcmToWav(Buffer.alloc(100), rate, 1);
      expect(wav.readUInt32LE(24)).toBe(rate);
      expect(wav.readUInt32LE(28)).toBe(rate * 1 * 2);
    }
  });
});
