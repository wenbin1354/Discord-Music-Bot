// MTA1NjY1NjI0OTU4MTc0MDEyMg.GVY96-.6tFI3uSCZpfDBrPdm4Xik5iPq29q9-ObvxsGlQ
// https://discord.com/api/oauth2/authorize?client_id=1056656249581740122&redirect_uri=https%3A%2F%2Fwww.google.com%2F&response_type=code&scope=voice

const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const prefix = '|';
const client = new Discord.Client();

//  take a YouTube URL as an argument and return a stream
function getStream(url) {
    return ytdl(url, { filter: 'audioonly' });
}

// the `play` command using the `client.on` function
client.on('message', message => {
    if (message.content.startsWith(`${prefix}play`)) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');

        const url = message.content.split(' ')[1];
        const stream = getStream(url);
        const dispatcher = voiceChannel.play(stream);
    }
});

// To stop the bot from playing audio, VoiceConnection.disconnect
client.on('message', message => {
    if (message.content === `${prefix}stop`) {
        const voiceChannel = message
    }
});
