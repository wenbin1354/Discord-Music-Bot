"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("../utils/i18n");
const queue_1 = require("../utils/queue");
const index_1 = require("../index");
exports.default = {
    name: "pause",
    description: i18n_1.i18n.__("pause.description"),
    execute(message) {
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue)
            return message.reply(i18n_1.i18n.__("pause.errorNotQueue")).catch(console.error);
        if (!(0, queue_1.canModifyQueue)(message.member))
            return i18n_1.i18n.__("common.errorNotChannel");
        if (queue.player.pause()) {
            queue.textChannel.send(i18n_1.i18n.__mf("pause.result", { author: message.author })).catch(console.error);
            return true;
        }
    }
};
//# sourceMappingURL=pause.js.map