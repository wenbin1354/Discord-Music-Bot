"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("../utils/i18n");
const queue_1 = require("../utils/queue");
const index_1 = require("../index");
exports.default = {
    name: "loop",
    aliases: ["l"],
    description: i18n_1.i18n.__("loop.description"),
    execute(message) {
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue)
            return message.reply(i18n_1.i18n.__("loop.errorNotQueue")).catch(console.error);
        if (!(0, queue_1.canModifyQueue)(message.member))
            return i18n_1.i18n.__("common.errorNotChannel");
        queue.loop = !queue.loop;
        return message
            .reply(i18n_1.i18n.__mf("loop.result", { loop: queue.loop ? i18n_1.i18n.__("common.on") : i18n_1.i18n.__("common.off") }))
            .catch(console.error);
    }
};
//# sourceMappingURL=loop.js.map