"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("../utils/queue");
const i18n_1 = require("../utils/i18n");
const index_1 = require("../index");
exports.default = {
    name: "skip",
    aliases: ["s"],
    description: i18n_1.i18n.__("skip.description"),
    execute(message) {
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue)
            return message.reply(i18n_1.i18n.__("skip.errorNotQueue")).catch(console.error);
        if (!(0, queue_1.canModifyQueue)(message.member))
            return i18n_1.i18n.__("common.errorNotChannel");
        queue.player.stop(true);
        queue.textChannel.send(i18n_1.i18n.__mf("skip.result", { author: message.author })).catch(console.error);
    }
};
//# sourceMappingURL=skip.js.map