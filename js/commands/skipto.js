"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("../utils/queue");
const i18n_1 = require("../utils/i18n");
const index_1 = require("../index");
exports.default = {
    name: "skipto",
    aliases: ["st"],
    description: i18n_1.i18n.__("skipto.description"),
    execute(message, args) {
        if (!args.length || isNaN(args[0]))
            return message
                .reply(i18n_1.i18n.__mf("skipto.usageReply", { prefix: index_1.bot.prefix, name: module.exports.name }))
                .catch(console.error);
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue)
            return message.reply(i18n_1.i18n.__("skipto.errorNotQueue")).catch(console.error);
        if (!(0, queue_1.canModifyQueue)(message.member))
            return i18n_1.i18n.__("common.errorNotChannel");
        if (args[0] > queue.songs.length)
            return message
                .reply(i18n_1.i18n.__mf("skipto.errorNotValid", { length: queue.songs.length }))
                .catch(console.error);
        if (queue.loop) {
            for (let i = 0; i < args[0] - 2; i++) {
                queue.songs.push(queue.songs.shift());
            }
        }
        else {
            queue.songs = queue.songs.slice(args[0] - 2);
        }
        queue.player.stop();
        queue.textChannel
            .send(i18n_1.i18n.__mf("skipto.result", { author: message.author, arg: args[0] - 1 }))
            .catch(console.error);
    }
};
//# sourceMappingURL=skipto.js.map