import { config } from "./config.js";
import { client } from "./discord.js";

client.login(config.discordBotToken);
