const { YoutubeiExtractor } = require("discord-player-youtubei");
const { Player } = require("discord-player");
const { ProxyAgent } = require("undici");

const auth = require(global.__basedir + "/auth.json");
const settings = require(global.__basedir + "/settings.json");

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

  youtubeiSettings = {
    ...(settings.proxyAddress && { proxy: new ProxyAgent(settings.proxyAddress) })
  };

  await player.extractors.register(YoutubeiExtractor, youtubeiSettings);

  return player;
};
