"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
const MusicQueue_1 = require("../structs/MusicQueue");
const Playlist_1 = require("../structs/Playlist");
const i18n_1 = require("../utils/i18n");
exports.default = {
    name: "playlist",
    cooldown: 5,
    aliases: ["pl"],
    description: i18n_1.i18n.__("playlist.description"),
    permissions: ["CONNECT", "SPEAK", "ADD_REACTIONS", "MANAGE_MESSAGES"],
    async execute(message, args) {
        const { channel } = message.member.voice;
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!args.length)
            return message.reply(i18n_1.i18n.__mf("playlist.usagesReply", { prefix: index_1.bot.prefix })).catch(console.error);
        if (!channel)
            return message.reply(i18n_1.i18n.__("playlist.errorNotChannel")).catch(console.error);
        if (queue && channel.id !== queue.connection.joinConfig.channelId)
            return message
                .reply(i18n_1.i18n.__mf("play.errorNotInSameChannel", { user: message.client.user.username }))
                .catch(console.error);
        let playlist;
        try {
            playlist = await Playlist_1.Playlist.from(args[0], args.join(" "));
        }
        catch (error) {
            console.error(error);
            return message.reply(i18n_1.i18n.__("playlist.errorNotFoundPlaylist")).catch(console.error);
        }
        if (queue) {
            queue.songs.push(...playlist.videos);
        }
        else {
            const newQueue = new MusicQueue_1.MusicQueue({
                message,
                connection: (0, voice_1.joinVoiceChannel)({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator
                })
            });
            index_1.bot.queues.set(message.guild.id, newQueue);
            newQueue.songs.push(...playlist.videos);
            newQueue.enqueue(playlist.videos[0]);
        }
        let playlistEmbed = new discord_js_1.MessageEmbed()
            .setTitle(`${playlist.data.title}`)
            .setDescription(playlist.videos.map((song, index) => `${index + 1}. ${song.title}`).join("\n"))
            .setURL(playlist.data.url)
            .setColor("#F8AA2A")
            .setTimestamp();
        if (playlistEmbed.description.length >= 2048)
            playlistEmbed.description =
                playlistEmbed.description.substr(0, 2007) + i18n_1.i18n.__("playlist.playlistCharLimit");
        message
            .reply({
            content: i18n_1.i18n.__mf("playlist.startedPlaylist", { author: message.author }),
            embeds: [playlistEmbed]
        })
            .catch(console.error);
    }
};
//# sourceMappingURL=playlist.js.map