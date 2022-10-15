
const { AutoPoster } = require("topgg-autoposter");
const { ShardingManager } = require("discord.js");
const auth = require("./auth.json");

const manager = new ShardingManager("./bot.js", { token: auth.token });

if (auth.topggToken) {
  const autoposter = AutoPoster(auth.topggToken, manager);
  autoposter.on("error", () => {
    console.log("Issue reaching top.gg website. Will try again later...");
  });
}

manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();