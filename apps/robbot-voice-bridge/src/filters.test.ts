import { describe, it, expect } from "vitest";
import { isWhisperHallucination } from "./filters.js";

describe("isWhisperHallucination", () => {
  const knownHallucinations = [
    "thank you.",
    "thank you",
    "thanks.",
    "thanks",
    "thanks for watching.",
    "thanks for watching!",
    "thanks for watching",
    "thank you for watching.",
    "thank you for watching",
    "subscribe to my channel.",
    "subscribe.",
    "you",
    "bye.",
    "bye!",
    "bye",
    "the end.",
    "the end",
    "...",
    "so",
    "i'm sorry.",
    "okay.",
    "oh.",
  ];

  it.each(knownHallucinations)(
    "detects known hallucination: %s",
    (text) => {
      expect(isWhisperHallucination(text)).toBe(true);
    },
  );

  it("is case insensitive", () => {
    expect(isWhisperHallucination("Thank You.")).toBe(true);
    expect(isWhisperHallucination("THANKS FOR WATCHING!")).toBe(true);
    expect(isWhisperHallucination("BYE!")).toBe(true);
    expect(isWhisperHallucination("The End.")).toBe(true);
  });

  it("returns false for legitimate speech", () => {
    expect(isWhisperHallucination("Hello, how are you?")).toBe(false);
    expect(isWhisperHallucination("Tell me about the weather")).toBe(false);
    expect(isWhisperHallucination("What time is it?")).toBe(false);
    expect(isWhisperHallucination("Thank you for your help with this project")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isWhisperHallucination("")).toBe(false);
  });

  it("returns false for single character", () => {
    expect(isWhisperHallucination("a")).toBe(false);
  });

  it("returns false for whitespace-only strings", () => {
    expect(isWhisperHallucination(" ")).toBe(false);
    expect(isWhisperHallucination("  ")).toBe(false);
    expect(isWhisperHallucination("\t")).toBe(false);
  });
});
