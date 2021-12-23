const { ShardingManager } = require("discord.js");
const auth = require("./auth.json");

const manager = new ShardingManager("./bot.js", { token: auth.token });

manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();
