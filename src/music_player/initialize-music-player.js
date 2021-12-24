const { Player } = require("discord-music-player");

const auth = require(__basedir + "/auth.json");

module.exports = function(client) {
  client.player = new Player(client, {
    leaveOnEnd: true,
    leaveOnStop: false,
    leaveOnEmpty: true,
    timeout: 300000,
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
