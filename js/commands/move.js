"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const array_move_1 = tslib_1.__importDefault(require("array-move"));
const i18n_1 = require("../utils/i18n");
const queue_1 = require("../utils/queue");
const index_1 = require("../index");
exports.default = {
    name: "move",
    aliases: ["mv"],
    description: i18n_1.i18n.__("move.description"),
    execute(message, args) {
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue)
            return message.reply(i18n_1.i18n.__("move.errorNotQueue")).catch(console.error);
        if (!(0, queue_1.canModifyQueue)(message.member))
            return;
        if (!args.length)
            return message.reply(i18n_1.i18n.__mf("move.usagesReply", { prefix: index_1.bot.prefix }));
        if (isNaN(args[0]) || args[0] <= 1)
            return message.reply(i18n_1.i18n.__mf("move.usagesReply", { prefix: index_1.bot.prefix }));
        let song = queue.songs[args[0] - 1];
        queue.songs = (0, array_move_1.default)(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);
        queue.textChannel.send(i18n_1.i18n.__mf("move.result", {
            author: message.author,
            title: song.title,
            index: args[1] == 1 ? 1 : args[1]
        }));
    }
};
//# sourceMappingURL=move.js.map