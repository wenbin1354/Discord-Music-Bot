## Discord Music Bot

The bot is currently hosts through digital ocean, to invite the bot to your server click [here](https://discord.com/api/oauth2/authorize?client_id=1056656249581740122&permissions=2184185856&scope=applications.commands%20bot)

The bot is built in typescript with discord.js, multiple libraries to handle YouTube videos, ffmpeg and libsodium-wrappers for processing audios etc..

## Getting Started

```sh
npm install
```

After installation finishes follow configuration instructions then run `npm run start` to start the bot.

## Configuration

Fill out `config.json` values:

⚠️ **Note: Never commit or share your token or api keys publicly** ⚠️

```json
{
  "TOKEN": "",
  "MAX_PLAYLIST_SIZE": 10,
  "PREFIX": "!",
  "PRUNING": false,
  "LOCALE": "en",
  "DEFAULT_VOLUME": 100,
  "STAY_TIME": 30
}
```

`TOKEN` is your bot token

`MAX_PLAYLIST_SIZE` is the max amount of songs that can be in the queue at once

`PREFIX` is the prefix for the bot

`PRUNING` is if the bot should prune its messages

`LOCALE` is the language for the bot to use

`DEFAULT_VOLUME` is the default volume for the bot

`STAY_TIME` is the time in seconds the bot will stay in the voice channel after the queue has ended


## Commands

> Note: The default prefix is '!'

- 🎶 Play music from YouTube via url

`!play https://www.youtube.com/watch?v=GLvohMXgcBo`

- 🔎 Play music from YouTube via search query

`!play under the bridge red hot chili peppers`

- 🎶 Play music from Soundcloud via url

`!play https://soundcloud.com/blackhorsebrigade/pearl-jam-alive`

- 🔎 Search and select music to play

`!search Pearl Jam`

Reply with song number or numbers seperated by comma that you wish to play

Examples: `1` or `1,2,3`

- 📃 Play youtube playlists via url

`!playlist https://www.youtube.com/watch?v=YlUKcNNmywk&list=PL5RNCwK3GIO13SR_o57bGJCEmqFAwq82c`

- 🔎 Play youtube playlists via search query

`!playlist linkin park meteora`

- Now Playing (!np)
- Queue system (!queue, !q)
- Loop / Repeat (!loop)
- Shuffle (!shuffle)
- Volume control (!volume, !v)
- Lyrics (!lyrics, !ly)
- Pause (!pause)
- Resume (!resume, !r)
- Skip (!skip, !s)
- Skip to song # in queue (!skipto, !st)
- Move a song in the queue (!move, !mv)
- Remove song # from queue (!remove, !rm)
- Show ping to Discord API (!ping)
- Show bot uptime (!uptime)
- Help (!help, !h)
- Command Handler from [discordjs.guide](https://discordjs.guide/)
- Media Controls via Reactions

