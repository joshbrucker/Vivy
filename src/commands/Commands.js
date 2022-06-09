const Discord = require("discord.js");

let Commands = new Discord.Collection();

Commands.set("clear", require("./music_player/clear.js"));
Commands.set("pause", require("./music_player/pause.js"));
Commands.set("playtop", require("./music_player/playtop.js"));
Commands.set("play", require("./music_player/play.js"));
Commands.set("queue", require("./music_player/queue.js"));
Commands.set("remove", require("./music_player/remove.js"));
Commands.set("resume", require("./music_player/resume.js"));
Commands.set("shuffle", require("./music_player/shuffle.js"));
Commands.set("skip", require("./music_player/skip.js"));
Commands.set("stop", require("./music_player/stop.js"));
Commands.set("swap", require("./music_player/swap.js"));

module.exports = Commands;
