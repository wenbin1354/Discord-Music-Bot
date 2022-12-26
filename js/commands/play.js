"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = require("@discordjs/voice");
const index_1 = require("../index");
const MusicQueue_1 = require("../structs/MusicQueue");
const Song_1 = require("../structs/Song");
const i18n_1 = require("../utils/i18n");
const patterns_1 = require("../utils/patterns");
exports.default = {
    name: "play",
    cooldown: 3,
    aliases: ["p"],
    description: i18n_1.i18n.__("play.description"),
    permissions: ["CONNECT", "SPEAK", "ADD_REACTIONS", "MANAGE_MESSAGES"],
    async execute(message, args) {
        const { channel } = message.member.voice;
        if (!channel)
            return message.reply(i18n_1.i18n.__("play.errorNotChannel")).catch(console.error);
        const queue = index_1.bot.queues.get(message.guild.id);
        if (queue && channel.id !== queue.connection.joinConfig.channelId)
            return message
                .reply(i18n_1.i18n.__mf("play.errorNotInSameChannel", { user: index_1.bot.client.user.username }))
                .catch(console.error);
        if (!args.length)
            return message.reply(i18n_1.i18n.__mf("play.usageReply", { prefix: index_1.bot.prefix })).catch(console.error);
        const url = args[0];
        const loadingReply = await message.reply("⏳ Loading...");
        // Start the playlist if playlist url was provided
        if (patterns_1.playlistPattern.test(args[0])) {
            await loadingReply.delete();
            return index_1.bot.commands.get("playlist").execute(message, args);
        }
        let song;
        try {
            song = await Song_1.Song.from(url, args.join(" "));
        }
        catch (error) {
            console.error(error);
            return message.reply(i18n_1.i18n.__("common.errorCommand")).catch(console.error);
        }
        finally {
            await loadingReply.delete();
        }
        if (queue) {
            queue.enqueue(song);
            return message
                .reply(i18n_1.i18n.__mf("play.queueAdded", { title: song.title, author: message.author }))
                .catch(console.error);
        }
        const newQueue = new MusicQueue_1.MusicQueue({
            message,
            connection: (0, voice_1.joinVoiceChannel)({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            })
        });
        index_1.bot.queues.set(message.guild.id, newQueue);
        newQueue.enqueue(song);
    }
};
//# sourceMappingURL=play.js.map