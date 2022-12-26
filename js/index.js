"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Bot_1 = require("./structs/Bot");
const config_json_1 = tslib_1.__importDefault(require("./config.json"));
const voice_1 = require("@discordjs/voice");
exports.bot = new Bot_1.Bot(new discord_js_1.Client({
    restTimeOffset: 0,
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
    ],
}));
// say ready when the bot is ready
exports.bot.client.on("ready", () => {
    console.log("WBB Ready!");
});
// join the channel the user is
exports.bot.client.on("messageCreate", async (message) => {
    if (message.content === config_json_1.default.PREFIX + "join") {
        const channel = message.member?.voice.channel;
        if (!channel)
            return;
        const connection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
    }
});
//# sourceMappingURL=index.js.map