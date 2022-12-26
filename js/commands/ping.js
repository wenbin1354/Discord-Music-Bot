"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("../utils/i18n");
exports.default = {
    name: "ping",
    cooldown: 10,
    description: i18n_1.i18n.__("ping.description"),
    execute(message) {
        message
            .reply(i18n_1.i18n.__mf("ping.result", { ping: Math.round(message.client.ws.ping) }))
            .catch(console.error);
    }
};
//# sourceMappingURL=ping.js.map