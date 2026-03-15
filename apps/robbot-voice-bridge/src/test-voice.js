import {
  Client,
  GatewayIntentBits,
  Events,
} from "discord.js";
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  EndBehaviorType,
  entersState,
} from "@discordjs/voice";

const {
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
} = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, async () => {
  console.log(`Ready as ${client.user.tag}`);
  
  // Find voice channel with members in it
  const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
  if (!guild) { console.log('No guild'); return; }
  
  const voiceChannels = guild.channels.cache.filter(c => c.type === 2);
  console.log('Voice channels:', voiceChannels.map(c => `${c.name} (${c.members.size} members)`).join(', '));
  
  // Find channel with a human in it
  const vc = voiceChannels.find(c => c.members.some(m => !m.user.bot));
  if (!vc) { console.log('No voice channel with humans. Join a voice channel first!'); return; }
  
  console.log(`Auto-joining ${vc.name}...`);
  
  const connection = joinVoiceChannel({
    channelId: vc.id,
    guildId: vc.guild.id,
    adapterCreator: vc.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: true,
  });

  connection.on(VoiceConnectionStatus.Ready, () => {
    console.log('[voice] Connected! Listening for speech...');
    
    connection.receiver.speaking.on("start", (userId) => {
      console.log(`[speaking] User ${userId} STARTED speaking`);
      
      const audioStream = connection.receiver.subscribe(userId, {
        end: { behavior: EndBehaviorType.AfterSilence, duration: 2000 },
      });
      
      let chunks = 0;
      audioStream.on("data", (chunk) => {
        chunks++;
        if (chunks === 1) console.log(`[audio] Receiving audio data from ${userId}...`);
        if (chunks % 50 === 0) console.log(`[audio] ${chunks} chunks received`);
      });
      
      audioStream.on("end", () => {
        console.log(`[audio] Stream ended. Total chunks: ${chunks}`);
      });
      
      audioStream.on("error", (err) => {
        console.error(`[audio] Error: ${err.message}`);
      });
    });
    
    connection.receiver.speaking.on("end", (userId) => {
      console.log(`[speaking] User ${userId} STOPPED speaking`);
    });
  });
  
  connection.on(VoiceConnectionStatus.Disconnected, () => {
    console.log('[voice] Disconnected');
  });
  
  connection.on("error", (err) => {
    console.error('[voice] Connection error:', err);
  });
});

client.login(DISCORD_BOT_TOKEN);
