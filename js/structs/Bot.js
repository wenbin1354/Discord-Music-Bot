"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const checkPermissions_1 = require("../utils/checkPermissions");
const config_1 = require("../utils/config");
const i18n_1 = require("../utils/i18n");
const MissingPermissionsException_1 = require("../utils/MissingPermissionsException");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
class Bot {
    client;
    prefix = config_1.config.PREFIX;
    commands = new discord_js_1.Collection();
    cooldowns = new discord_js_1.Collection();
    queues = new discord_js_1.Collection();
    constructor(client) {
        this.client = client;
        this.client.login(config_1.config.TOKEN);
        this.client.on("warn", (info) => console.log(info));
        this.client.on("error", console.error);
        this.importCommands();
        this.onMessageCreate();
    }
    async importCommands() {
        var _a;
        const commandFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "..", "commands")).filter((file) => !file.endsWith(".map"));
        for (const file of commandFiles) {
            const command = await (_a = (0, path_1.join)(__dirname, "..", "commands", `${file}`), Promise.resolve().then(() => __importStar(require(_a))));
            this.commands.set(command.default.name, command.default);
        }
    }
    async onMessageCreate() {
        this.client.on("messageCreate", async (message) => {
            if (message.author.bot || !message.guild)
                return;
            const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(this.prefix)})\\s*`);
            if (!prefixRegex.test(message.content))
                return;
            const [, matchedPrefix] = message.content.match(prefixRegex);
            const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = args.shift()?.toLowerCase();
            // @ts-ignore
            const command = 
            // @ts-ignore
            this.commands.get(commandName) ?? this.commands.find((cmd) => cmd.aliases?.includes(commandName));
            if (!command)
                return;
            if (!this.cooldowns.has(command.name)) {
                this.cooldowns.set(command.name, new discord_js_1.Collection());
            }
            const now = Date.now();
            const timestamps = this.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 1) * 1000;
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(i18n_1.i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name }));
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            try {
                const permissionsCheck = await (0, checkPermissions_1.checkPermissions)(command, message);
                if (permissionsCheck.result) {
                    command.execute(message, args);
                }
                else {
                    throw new MissingPermissionsException_1.MissingPermissionsException(permissionsCheck.missing);
                }
            }
            catch (error) {
                console.error(error);
                if (error.message.includes("permissions")) {
                    message.reply(error.toString()).catch(console.error);
                }
                else {
                    message.reply(i18n_1.i18n.__("common.errorCommand")).catch(console.error);
                }
            }
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map