"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
const i18n_1 = require("../utils/i18n");
exports.default = {
    name: "queue",
    cooldown: 5,
    aliases: ["q"],
    description: i18n_1.i18n.__("queue.description"),
    permissions: ["MANAGE_MESSAGES", "ADD_REACTIONS"],
    async execute(message) {
        const queue = index_1.bot.queues.get(message.guild.id);
        if (!queue || !queue.songs.length)
            return message.reply(i18n_1.i18n.__("queue.errorNotQueue"));
        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs);
        const queueEmbed = await message.reply({
            content: `**${i18n_1.i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
            embeds: [embeds[currentPage]]
        });
        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("⏹");
            await queueEmbed.react("➡️");
        }
        catch (error) {
            console.error(error);
            message.reply(error.message).catch(console.error);
        }
        const filter = (reaction, user) => ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
        const collector = queueEmbed.createReactionCollector({ filter, time: 60000 });
        collector.on("collect", async (reaction, user) => {
            try {
                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit({
                            content: i18n_1.i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                }
                else if (reaction.emoji.name === "⬅️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit({
                            content: i18n_1.i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                }
                else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(message.author.id);
            }
            catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        });
    }
};
function generateQueueEmbed(message, songs) {
    let embeds = [];
    let k = 10;
    for (let i = 0; i < songs.length; i += 10) {
        const current = songs.slice(i, k);
        let j = i;
        k += 10;
        const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(i18n_1.i18n.__("queue.embedTitle"))
            .setThumbnail(message.guild?.iconURL())
            .setColor("#F8AA2A")
            .setDescription(i18n_1.i18n.__mf("queue.embedCurrentSong", { title: songs[0].title, url: songs[0].url, info: info }))
            .setTimestamp();
        embeds.push(embed);
    }
    return embeds;
}
//# sourceMappingURL=queue.js.map