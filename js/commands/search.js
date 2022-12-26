"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const youtube_sr_1 = tslib_1.__importDefault(require("youtube-sr"));
const index_1 = require("../index");
const i18n_1 = require("../utils/i18n");
exports.default = {
    name: "search",
    description: i18n_1.i18n.__("search.description"),
    async execute(message, args) {
        if (!args.length)
            return message
                .reply(i18n_1.i18n.__mf("search.usageReply", { prefix: index_1.bot.prefix, name: module.exports.name }))
                .catch(console.error);
        if (message.channel.activeCollector)
            return message.reply(i18n_1.i18n.__("search.errorAlreadyCollector"));
        if (!message.member?.voice.channel)
            return message.reply(i18n_1.i18n.__("search.errorNotChannel")).catch(console.error);
        const search = args.join(" ");
        let resultsEmbed = new discord_js_1.MessageEmbed()
            .setTitle(i18n_1.i18n.__("search.resultEmbedTitle"))
            .setDescription(i18n_1.i18n.__mf("search.resultEmbedDesc", { search: search }))
            .setColor("#F8AA2A");
        try {
            const results = await youtube_sr_1.default.search(search, { limit: 10, type: "video" });
            results.map((video, index) => resultsEmbed.addField(`https://youtube.com/watch?v=${video.id}`, `${index + 1}. ${video.title}`));
            let resultsMessage = await message.channel.send({ embeds: [resultsEmbed] });
            function filter(msg) {
                const pattern = /^[1-9][0]?(\s*,\s*[1-9][0]?)*$/;
                return pattern.test(msg.content);
            }
            message.channel.activeCollector = true;
            const response = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] });
            const reply = response.first().content;
            if (reply.includes(",")) {
                let songs = reply.split(",").map((str) => str.trim());
                for (let song of songs) {
                    await index_1.bot.commands.get("play").execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
                }
            }
            else {
                const choice = resultsEmbed.fields[parseInt(response.first()?.toString()) - 1].name;
                index_1.bot.commands.get("play").execute(message, [choice]);
            }
            message.channel.activeCollector = false;
            resultsMessage.delete().catch(console.error);
            response.first().delete().catch(console.error);
        }
        catch (error) {
            console.error(error);
            message.channel.activeCollector = false;
            message.reply(i18n_1.i18n.__("common.errorCommand")).catch(console.error);
        }
    }
};
//# sourceMappingURL=search.js.map