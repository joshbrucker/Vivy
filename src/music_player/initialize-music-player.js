const { Player } = require("discord-music-player");

const auth = require(__basedir + "/auth.json");

module.exports = function(client) {
  client.player = new Player(client, {
    leaveOnEnd: false,
    leaveOnStop: false,
    leaveOnEmpty: false,
    ytdlRequestOptions:  {
      headers: {
        cookie: auth["youtubeCookie"],
      },
    }
  });

  client.player
    .on('channelEmpty',  (queue) => {})
    .on('songAdd',  (queue, song) => {})
    .on('playlistAdd',  (queue, playlist) => {})
    .on('queueDestroyed',  (queue) => {})
    .on('queueEnd',  (queue) => {})
    .on('songChanged', (queue, newSong, oldSong) => {})
    .on('songFirst',  (queue, song) => {})
    .on('clientDisconnect', (queue) => {})
    .on('clientUndeafen', (queue) => {})
    .on('error', (error, queue) => {});
};
