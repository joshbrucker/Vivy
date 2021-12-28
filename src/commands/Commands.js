const Discord = require("discord.js");

let Commands = new Discord.Collection();

Commands.set("play", require("./audio/music/play.js"));
Commands.set("shuffle", require("./audio/music/shuffle.js"));
Commands.set("skip", require("./audio/music/skip.js"));
Commands.set("queue", require("./audio/music/queue.js"));

module.exports = Commands;
