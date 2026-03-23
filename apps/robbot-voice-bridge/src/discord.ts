import { ChannelType, Client, Events, GatewayIntentBits } from "discord.js";
import type { Guild, VoiceBasedChannel } from "discord.js";
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  EndBehaviorType,
  createAudioPlayer,
  NoSubscriberBehavior,
} from "@discordjs/voice";
import OpusScript from "opusscript";
import { config } from "./config.js";
import { handleSpeech, interruptPipeline } from "./pipeline.js";
import type { VoiceState } from "./types.js";

const state: VoiceState = {
  voiceConnection: null,
  audioPlayer: null,
  logChannel: null,
  isProcessing: false,
  isPlaying: false,
  conversationHistory: [],
  abortController: null,
  activeAudioQueue: null,
  isInterrupting: false,
};

function setupReceiver(voiceState: VoiceState): void {
  const { voiceConnection } = voiceState;
  if (!voiceConnection) return;

  const decoder = new OpusScript(config.sampleRate, config.channels);
  const activeStreams = new Map<string, true>();

  voiceConnection.receiver.speaking.on("start", (userId: string) => {
    if (userId === client.user?.id) return;
    if (activeStreams.has(userId)) return;

    // Check if user is muted — Discord sends speaking events even when muted
    const guild = client.guilds.cache.get(config.discordGuildId);
    const member = guild?.members.cache.get(userId);
    if (member?.voice.selfMute || member?.voice.serverMute) {
      return;
    }

    const pcmChunks: Array<Buffer> = [];
    const speechStartMs = Date.now();
    const opusStream = voiceConnection.receiver.subscribe(userId, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: config.silenceMs,
      },
    });

    activeStreams.set(userId, true);

    // Debounced interrupt: only fire after minDuration of actual speech
    // to avoid false triggers from coughs, background noise, etc.
    let interruptTimer: ReturnType<typeof setTimeout> | null = null;
    if (
      config.interruptEnabled &&
      voiceState.isProcessing &&
      voiceState.isPlaying &&
      !voiceState.isInterrupting
    ) {
      interruptTimer = setTimeout(() => {
        // Re-check mute status — user may have muted during the debounce window
        const freshMember = guild?.members.cache.get(userId);
        if (freshMember?.voice.selfMute || freshMember?.voice.serverMute) {
          return;
        }
        if (
          voiceState.isProcessing &&
          voiceState.isPlaying &&
          !voiceState.isInterrupting &&
          pcmChunks.length > 0
        ) {
          console.log(`[interrupt] User ${userId} speaking during playback (debounced)`);
          interruptPipeline(voiceState);
        }
      }, config.interruptMinDurationMs);
    }

    opusStream.on("data", (packet: Buffer) => {
      try {
        const decoded = decoder.decode(packet);
        pcmChunks.push(Buffer.from(decoded));
      } catch (err) {
        console.warn(
          `[opus] Decode error for ${userId}:`,
          err instanceof Error ? err.message : err,
        );
      }
    });

    opusStream.on("end", () => {
      activeStreams.delete(userId);
      if (interruptTimer) clearTimeout(interruptTimer);
      const durationMs = Date.now() - speechStartMs;
      if (durationMs < config.interruptMinDurationMs) {
        console.log(`[skip] Speech too short for processing (${durationMs}ms)`);
        return;
      }
      void handleSpeech(client as Client<true>, voiceState, userId, pcmChunks);
    });

    opusStream.on("error", (err: Error) => {
      console.error(`[stream] ${userId}:`, err.message);
      activeStreams.delete(userId);
    });
  });
}

function setupConnectionRecovery(voiceState: VoiceState): void {
  const { voiceConnection } = voiceState;
  if (!voiceConnection) return;

  voiceConnection.on(VoiceConnectionStatus.Disconnected, async () => {
    console.warn("[bot] Voice connection disconnected, attempting recovery...");
    try {
      await Promise.race([
        entersState(voiceConnection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
      console.log("[bot] Reconnecting automatically...");
    } catch {
      console.warn("[bot] Recovery failed, destroying connection");
      voiceConnection.destroy();
      voiceState.voiceConnection = null;
      voiceState.audioPlayer = null;
    }
  });
}

function connectToChannel(channel: VoiceBasedChannel): void {
  state.voiceConnection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });
  state.audioPlayer = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Play },
  });
  state.voiceConnection.subscribe(state.audioPlayer);
}

async function autoJoin(guild: Guild): Promise<void> {
  const vc = guild.channels.cache.find(
    (c): c is VoiceBasedChannel =>
      (c.type === ChannelType.GuildVoice ||
        c.type === ChannelType.GuildStageVoice) &&
        "members" in c &&
        c.members.some((m) => !m.user.bot),
  );
  if (!vc) return;

  console.log(`[bot] Auto-joining ${vc.name}...`);
  connectToChannel(vc);

  try {
    await entersState(
      state.voiceConnection!,
      VoiceConnectionStatus.Ready,
      30_000,
    );
    setupReceiver(state);
    setupConnectionRecovery(state);
    console.log("[bot] Connected and listening!");
  } catch (err) {
    console.error(
      "[bot] Failed:",
      err instanceof Error ? err.message : err,
    );
    state.voiceConnection?.destroy();
    state.voiceConnection = null;
  }
}

// ── Discord Client ──────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content === "!join") {
    const vc = message.member?.voice?.channel;
    if (!vc) {
      await message.reply("Join a voice channel first!");
      return;
    }
    if (state.voiceConnection) state.voiceConnection.destroy();

    connectToChannel(vc);

    try {
      await entersState(
        state.voiceConnection!,
        VoiceConnectionStatus.Ready,
        30_000,
      );
      setupReceiver(state);
      setupConnectionRecovery(state);
      await message.reply("🦞 Listening!");
    } catch {
      await message.reply("Failed to connect.");
      state.voiceConnection?.destroy();
      state.voiceConnection = null;
    }
  }

  if (message.content === "!leave") {
    state.abortController?.abort();
    state.abortController = null;
    state.activeAudioQueue?.interrupt();
    state.activeAudioQueue = null;
    state.isProcessing = false;
    state.isPlaying = false;
    state.voiceConnection?.destroy();
    state.voiceConnection = null;
    state.audioPlayer = null;
    await message.reply("👋");
  }
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  if (newState.channel && !state.voiceConnection && !newState.member?.user.bot) {
    await autoJoin(newState.guild);
  }
  if (oldState.channel && state.voiceConnection) {
    const botChannelId = state.voiceConnection.joinConfig.channelId;
    if (oldState.channel.id === botChannelId) {
      const humans = oldState.channel.members.filter((m) => !m.user.bot);
      if (humans.size === 0) {
        console.log("[bot] Everyone left, disconnecting");
        state.abortController?.abort();
        state.abortController = null;
        state.activeAudioQueue?.interrupt();
        state.activeAudioQueue = null;
        state.isProcessing = false;
        state.isPlaying = false;
        state.voiceConnection.destroy();
        state.voiceConnection = null;
        state.audioPlayer = null;
      }
    }
  }
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`[bot] Logged in as ${readyClient.user.tag}`);
  const guild = readyClient.guilds.cache.get(config.discordGuildId);
  if (!guild) {
    console.error("[bot] Guild not found!");
    process.exit(1);
  }
  const logCh = guild.channels.cache.get(config.voiceLogChannelId);
  state.logChannel = logCh && "send" in logCh ? logCh : null;
  if (state.logChannel && "name" in state.logChannel) {
    console.log(`[bot] Log channel: #${state.logChannel.name}`);
  }
  await autoJoin(guild);
});

export { client };
