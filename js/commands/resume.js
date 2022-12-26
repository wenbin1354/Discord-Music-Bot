"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const i18n_1 = require("../utils/i18n");
const queue_1 = require("../utils/queue");
exports.default = {
    name: "resume",
    aliases: ["r"],
    description: i18n_1.i18n.__("resume.description"),
    execute(message) {
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue)
            return message.reply(i18n_1.i18n.__("resume.errorNotQueue")).catch(console.error);
        if (!(0, queue_1.canModifyQueue)(message.member))
            return i18n_1.i18n.__("common.errorNotChannel");
        if (queue.player.unpause()) {
            queue.textChannel
                .send(i18n_1.i18n.__mf("resume.resultNotPlaying", { author: message.author }))
                .catch(console.error);
            return true;
        }
        message.reply(i18n_1.i18n.__("resume.errorPlaying")).catch(console.error);
        return false;
    }
};
//# sourceMappingURL=resume.js.map