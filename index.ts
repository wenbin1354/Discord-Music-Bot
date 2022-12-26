import { Client, Intents } from "discord.js";
import { Bot } from "./structs/Bot";
import config from "./config.json";
import { joinVoiceChannel } from "@discordjs/voice";

export const bot = new Bot(
	new Client({
		restTimeOffset: 0,
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_VOICE_STATES,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			Intents.FLAGS.DIRECT_MESSAGES,
		],
	})
);

// say ready when the bot is ready
bot.client.on("ready", () => {
	console.log("WBB Ready!");
});

// join the channel the user is
bot.client.on("messageCreate", async (message) => {
	if (message.content === config.PREFIX + "join") {
		const channel = message.member?.voice.channel;
		if (!channel) return;
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
	}
});
