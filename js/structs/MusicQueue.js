"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicQueue = void 0;
const voice_1 = require("@discordjs/voice");
const node_util_1 = require("node:util");
const index_1 = require("../index");
const config_1 = require("../utils/config");
const i18n_1 = require("../utils/i18n");
const queue_1 = require("../utils/queue");
const wait = (0, node_util_1.promisify)(setTimeout);
class MusicQueue {
    message;
    connection;
    player;
    textChannel;
    bot = index_1.bot;
    resource;
    songs = [];
    volume = config_1.config.DEFAULT_VOLUME || 100;
    loop = false;
    muted = false;
    waitTimeout;
    queueLock = false;
    readyLock = false;
    constructor(options) {
        Object.assign(this, options);
        this.textChannel = options.message.channel;
        this.player = (0, voice_1.createAudioPlayer)({ behaviors: { noSubscriber: voice_1.NoSubscriberBehavior.Play } });
        this.connection.subscribe(this.player);
        this.connection.on("stateChange", async (oldState, newState) => {
            if (newState.status === voice_1.VoiceConnectionStatus.Disconnected) {
                if (newState.reason === voice_1.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        this.stop();
                    }
                    catch (e) {
                        console.log(e);
                        this.stop();
                    }
                }
                else if (this.connection.rejoinAttempts < 5) {
                    await wait((this.connection.rejoinAttempts + 1) * 5000);
                    this.connection.rejoin();
                }
                else {
                    this.connection.destroy();
                }
            }
            else if (!this.readyLock &&
                (newState.status === voice_1.VoiceConnectionStatus.Connecting || newState.status === voice_1.VoiceConnectionStatus.Signalling)) {
                this.readyLock = true;
                try {
                    await (0, voice_1.entersState)(this.connection, voice_1.VoiceConnectionStatus.Ready, 20000);
                }
                catch {
                    if (this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                        try {
                            this.connection.destroy();
                        }
                        catch { }
                    }
                }
                finally {
                    this.readyLock = false;
                }
            }
        });
        this.player.on("stateChange", async (oldState, newState) => {
            if (oldState.status !== voice_1.AudioPlayerStatus.Idle && newState.status === voice_1.AudioPlayerStatus.Idle) {
                if (this.loop && this.songs.length) {
                    this.songs.push(this.songs.shift());
                }
                else {
                    this.songs.shift();
                }
                if (this.songs.length || this.resource)
                    this.processQueue();
            }
            else if (oldState.status === voice_1.AudioPlayerStatus.Buffering && newState.status === voice_1.AudioPlayerStatus.Playing) {
                this.sendPlayingMessage(newState);
            }
        });
        this.player.on("error", (error) => {
            console.error(error);
            if (this.loop && this.songs.length) {
                this.songs.push(this.songs.shift());
            }
            else {
                this.songs.shift();
            }
            this.processQueue();
        });
    }
    enqueue(...songs) {
        if (typeof this.waitTimeout !== "undefined")
            clearTimeout(this.waitTimeout);
        this.songs = this.songs.concat(songs);
        this.processQueue();
    }
    stop() {
        this.loop = false;
        this.songs = [];
        this.player.stop();
        !config_1.config.PRUNING && this.textChannel.send(i18n_1.i18n.__("play.queueEnded")).catch(console.error);
        this.waitTimeout = setTimeout(() => {
            if (this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                try {
                    this.connection.destroy();
                }
                catch { }
            }
            index_1.bot.queues.delete(this.message.guild.id);
            !config_1.config.PRUNING && this.textChannel.send(i18n_1.i18n.__("play.leaveChannel"));
        }, config_1.config.STAY_TIME * 1000);
    }
    async processQueue() {
        if (this.queueLock || this.player.state.status !== voice_1.AudioPlayerStatus.Idle) {
            return;
        }
        if (!this.songs.length) {
            return this.stop();
        }
        this.queueLock = true;
        const next = this.songs[0];
        try {
            const resource = await next.makeResource();
            this.resource = resource;
            this.player.play(this.resource);
            this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
        }
        catch (error) {
            console.error(error);
            return this.processQueue();
        }
        finally {
            this.queueLock = false;
        }
    }
    async sendPlayingMessage(newState) {
        const song = newState.resource.metadata;
        let playingMessage;
        try {
            playingMessage = await this.textChannel.send(newState.resource.metadata.startMessage());
            await playingMessage.react("⏭");
            await playingMessage.react("⏯");
            await playingMessage.react("🔇");
            await playingMessage.react("🔉");
            await playingMessage.react("🔊");
            await playingMessage.react("🔁");
            await playingMessage.react("🔀");
            await playingMessage.react("⏹");
        }
        catch (error) {
            console.error(error);
            this.textChannel.send(error.message);
            return;
        }
        const filter = (reaction, user) => user.id !== this.textChannel.client.user.id;
        const collector = playingMessage.createReactionCollector({
            filter,
            time: song.duration > 0 ? song.duration * 1000 : 600000
        });
        collector.on("collect", async (reaction, user) => {
            if (!this.songs)
                return;
            const member = await playingMessage.guild.members.fetch(user);
            switch (reaction.emoji.name) {
                case "⏭":
                    reaction.users.remove(user).catch(console.error);
                    await this.bot.commands.get("skip").execute(this.message);
                    break;
                case "⏯":
                    reaction.users.remove(user).catch(console.error);
                    if (this.player.state.status == voice_1.AudioPlayerStatus.Playing) {
                        await this.bot.commands.get("pause").execute(this.message);
                    }
                    else {
                        await this.bot.commands.get("resume").execute(this.message);
                    }
                    break;
                case "🔇":
                    reaction.users.remove(user).catch(console.error);
                    if (!(0, queue_1.canModifyQueue)(member))
                        return i18n_1.i18n.__("common.errorNotChannel");
                    this.muted = !this.muted;
                    if (this.muted) {
                        this.resource.volume?.setVolumeLogarithmic(0);
                        this.textChannel.send(i18n_1.i18n.__mf("play.mutedSong", { author: user })).catch(console.error);
                    }
                    else {
                        this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
                        this.textChannel.send(i18n_1.i18n.__mf("play.unmutedSong", { author: user })).catch(console.error);
                    }
                    break;
                case "🔉":
                    reaction.users.remove(user).catch(console.error);
                    if (this.volume == 0)
                        return;
                    if (!(0, queue_1.canModifyQueue)(member))
                        return i18n_1.i18n.__("common.errorNotChannel");
                    this.volume = Math.max(this.volume - 10, 0);
                    this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
                    this.textChannel
                        .send(i18n_1.i18n.__mf("play.decreasedVolume", { author: user, volume: this.volume }))
                        .catch(console.error);
                    break;
                case "🔊":
                    reaction.users.remove(user).catch(console.error);
                    if (this.volume == 100)
                        return;
                    if (!(0, queue_1.canModifyQueue)(member))
                        return i18n_1.i18n.__("common.errorNotChannel");
                    this.volume = Math.min(this.volume + 10, 100);
                    this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
                    this.textChannel
                        .send(i18n_1.i18n.__mf("play.increasedVolume", { author: user, volume: this.volume }))
                        .catch(console.error);
                    break;
                case "🔁":
                    reaction.users.remove(user).catch(console.error);
                    await this.bot.commands.get("loop").execute(this.message);
                    break;
                case "🔀":
                    reaction.users.remove(user).catch(console.error);
                    await this.bot.commands.get("shuffle").execute(this.message);
                    break;
                case "⏹":
                    reaction.users.remove(user).catch(console.error);
                    await this.bot.commands.get("stop").execute(this.message);
                    collector.stop();
                    break;
                default:
                    reaction.users.remove(user).catch(console.error);
                    break;
            }
        });
        collector.on("end", () => {
            playingMessage.reactions.removeAll().catch(console.error);
            if (config_1.config.PRUNING) {
                setTimeout(() => {
                    playingMessage.delete().catch();
                }, 3000);
            }
        });
    }
}
exports.MusicQueue = MusicQueue;
//# sourceMappingURL=MusicQueue.js.map