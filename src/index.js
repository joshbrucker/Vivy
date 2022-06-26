
const { AutoPoster } = require("topgg-autoposter");
const { ShardingManager } = require("discord.js");
const auth = require("./auth.json");

const manager = new ShardingManager("./bot.js", { token: auth.token });
const poster = AutoPoster(auth.topggToken, manager);

manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();
