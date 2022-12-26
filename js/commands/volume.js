"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("../utils/i18n");
const queue_1 = require("../utils/queue");
const index_1 = require("../index");
exports.default = {
    name: "volume",
    aliases: ["v"],
    description: i18n_1.i18n.__("volume.description"),
    execute(message, args) {
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue)
            return message.reply(i18n_1.i18n.__("volume.errorNotQueue")).catch(console.error);
        if (!(0, queue_1.canModifyQueue)(message.member))
            return message.reply(i18n_1.i18n.__("volume.errorNotChannel")).catch(console.error);
        if (!args[0])
            return message.reply(i18n_1.i18n.__mf("volume.currentVolume", { volume: queue.volume })).catch(console.error);
        if (isNaN(args[0]))
            return message.reply(i18n_1.i18n.__("volume.errorNotNumber")).catch(console.error);
        if (Number(args[0]) > 100 || Number(args[0]) < 0)
            return message.reply(i18n_1.i18n.__("volume.errorNotValid")).catch(console.error);
        queue.volume = args[0];
        queue.resource.volume?.setVolumeLogarithmic(args[0] / 100);
        return message.reply(i18n_1.i18n.__mf("volume.result", { arg: args[0] })).catch(console.error);
    }
};
//# sourceMappingURL=volume.js.map