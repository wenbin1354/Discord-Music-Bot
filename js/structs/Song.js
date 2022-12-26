"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = void 0;
const tslib_1 = require("tslib");
const voice_1 = require("@discordjs/voice");
const youtube_sr_1 = tslib_1.__importDefault(require("youtube-sr"));
const ytdl_core_1 = require("ytdl-core");
const ytdl_core_discord_1 = tslib_1.__importDefault(require("ytdl-core-discord"));
const i18n_1 = require("../utils/i18n");
const patterns_1 = require("../utils/patterns");
class Song {
    url;
    title;
    duration;
    constructor({ url, title, duration }) {
        this.url = url;
        this.title = title;
        this.duration = duration;
    }
    static async from(url = "", search = "") {
        const isYoutubeUrl = patterns_1.videoPattern.test(url);
        // const isScUrl = scRegex.test(url);
        let songInfo;
        if (isYoutubeUrl) {
            songInfo = await (0, ytdl_core_1.getInfo)(url);
            return new this({
                url: songInfo.videoDetails.video_url,
                title: songInfo.videoDetails.title,
                duration: parseInt(songInfo.videoDetails.lengthSeconds)
            });
        }
        else {
            const result = await youtube_sr_1.default.searchOne(search);
            songInfo = await (0, ytdl_core_1.getInfo)(`https://youtube.com/watch?v=${result.id}`);
            return new this({
                url: songInfo.videoDetails.video_url,
                title: songInfo.videoDetails.title,
                duration: parseInt(songInfo.videoDetails.lengthSeconds)
            });
        }
    }
    async makeResource() {
        let stream;
        let type = this.url.includes("youtube.com") ? voice_1.StreamType.Opus : voice_1.StreamType.OggOpus;
        const source = this.url.includes("youtube") ? "youtube" : "soundcloud";
        if (source === "youtube") {
            stream = await (0, ytdl_core_discord_1.default)(this.url, { quality: "highestaudio", highWaterMark: 1 << 25 });
        }
        if (!stream)
            return;
        return (0, voice_1.createAudioResource)(stream, { metadata: this, inputType: type, inlineVolume: true });
    }
    startMessage() {
        return i18n_1.i18n.__mf("play.startedPlaying", { title: this.title, url: this.url });
    }
}
exports.Song = Song;
//# sourceMappingURL=Song.js.map