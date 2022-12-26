"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const string_progressbar_1 = require("string-progressbar");
const i18n_1 = require("../utils/i18n");
const index_1 = require("../index");
exports.default = {
    name: "np",
    cooldown: 10,
    description: i18n_1.i18n.__("nowplaying.description"),
    execute(message) {
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue || !queue.songs.length)
            return message.reply(i18n_1.i18n.__("nowplaying.errorNotQueue")).catch(console.error);
        const song = queue.songs[0];
        const seek = queue.resource.playbackDuration / 1000;
        const left = song.duration - seek;
        let nowPlaying = new discord_js_1.MessageEmbed()
            .setTitle(i18n_1.i18n.__("nowplaying.embedTitle"))
            .setDescription(`${song.title}\n${song.url}`)
            .setColor("#F8AA2A");
        if (song.duration > 0) {
            nowPlaying.addField("\u200b", new Date(seek * 1000).toISOString().substr(11, 8) +
                "[" +
                (0, string_progressbar_1.splitBar)(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
                "]" +
                (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)), false);
            nowPlaying.setFooter({
                text: i18n_1.i18n.__mf("nowplaying.timeRemaining", {
                    time: new Date(left * 1000).toISOString().substr(11, 8)
                })
            });
        }
        return message.reply({ embeds: [nowPlaying] });
    }
};
//# sourceMappingURL=nowplaying.js.map