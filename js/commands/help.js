"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const i18n_1 = require("../utils/i18n");
const index_1 = require("../index");
exports.default = {
    name: "help",
    aliases: ["h"],
    description: i18n_1.i18n.__("help.description"),
    execute(message) {
        let commands = index_1.bot.commands;
        let helpEmbed = new discord_js_1.MessageEmbed()
            .setTitle(i18n_1.i18n.__mf("help.embedTitle", { botname: message.client.user.username }))
            .setDescription(i18n_1.i18n.__("help.embedDescription"))
            .setColor("#F8AA2A");
        commands.forEach((cmd) => {
            helpEmbed.addField(`**${index_1.bot.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`, `${cmd.description}`, true);
        });
        helpEmbed.setTimestamp();
        return message.reply({ embeds: [helpEmbed] }).catch(console.error);
    }
};
//# sourceMappingURL=help.js.map