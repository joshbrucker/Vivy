const { YouTubeExtractor } = require("@discord-player/extractor");
const { Player } = require("discord-player");

const auth = require(global.__basedir + "/auth.json");

module.exports = async (client) => {
  let player = new Player(client, {
    connectionTimeout: 600000,
    ytdlOptions: {
      requestOptions: {
        headers: {
          cookie: auth["youtubeCookie"],
        }
      }
    }
  });

  await player.extractors.register(YouTubeExtractor, {});

  return player;
};
