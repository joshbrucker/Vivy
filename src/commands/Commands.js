const Discord = require("discord.js");

let Commands = new Discord.Collection();

Commands.set("play", require("./music_player/play.js"));
Commands.set("skip", require("./music_player/skip.js"));
Commands.set("queue", require("./music_player/queue/queue.js"));

module.exports = Commands;
