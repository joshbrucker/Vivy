const { Routes } = require("discord-api-types/v10");
const { REST } = require("@discordjs/rest");

const Commands = require(global.__basedir + "/commands/Commands.js");
const createMusicPlayer = require(global.__basedir + "/music_player/create-music-player.js");
const auth = require(global.__basedir + "/auth.json");
const settings = require(global.__basedir + "/settings.json");

module.exports = async (client) => {
  const rest = new REST({ version: "10" }).setToken(auth.token);
  const commandJSONs = Commands.map(command => command.data);

  // Register commands
  if (settings.dev.active) {
    await rest.put(Routes.applicationGuildCommands(client.user.id, settings.dev.guild), { body: commandJSONs })
        .catch(console.error);
  } else {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commandJSONs })
        .catch(console.error);
  }

  // Set up player
  client.player = await createMusicPlayer(client);

  console.log("I'm ready to perform~!");
};
