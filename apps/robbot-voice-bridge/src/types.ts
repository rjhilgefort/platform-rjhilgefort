import type { VoiceConnection, AudioPlayer } from "@discordjs/voice";
import type { SendableChannels } from "discord.js";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface WhisperResponse {
  text: string;
}

export interface OpenClawChoice {
  message: {
    content?: string;
  };
}

export interface OpenClawResponse {
  choices: Array<OpenClawChoice>;
}

export interface VoiceState {
  voiceConnection: VoiceConnection | null;
  audioPlayer: AudioPlayer | null;
  logChannel: SendableChannels | null;
  isProcessing: boolean;
  conversationHistory: Array<ChatMessage>;
}
