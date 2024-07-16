const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei");
const { SpotifyExtractor } = require("@discord-player/extractor");
const { Player } = require("discord-player");

const auth = require(global.__basedir + "/auth.json");

module.exports = async (client) => {
  let player = new Player(client, {
    connectionTimeout: 600000,
    ytdlOptions: {
      requestOptions: {
        headers: {
          cookie: auth["youtubeCookies"],
          "x-youtube-identity-token": auth["youtubeIdToken"]
        }
      }
    }
  });

  await player.extractors.register(YoutubeiExtractor, {
    authentication: auth["youtubeOAuth"]
  });
  await player.extractors.register(SpotifyExtractor, {
    createStream: createYoutubeiStream
  });

  return player;
};
