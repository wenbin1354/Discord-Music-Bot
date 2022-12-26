"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("../utils/queue");
const i18n_1 = require("../utils/i18n");
const index_1 = require("../index");
exports.default = {
    name: "shuffle",
    description: i18n_1.i18n.__("shuffle.description"),
    execute(message) {
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue)
            return message.reply(i18n_1.i18n.__("shuffle.errorNotQueue")).catch(console.error);
        if (!(0, queue_1.canModifyQueue)(message.member))
            return i18n_1.i18n.__("common.errorNotChannel");
        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        queue.textChannel.send(i18n_1.i18n.__mf("shuffle.result", { author: message.author })).catch(console.error);
    }
};
//# sourceMappingURL=shuffle.js.map