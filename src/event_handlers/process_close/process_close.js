const { Routes } = require("discord-api-types/v10");
const { REST } = require("@discordjs/rest");

const auth = require(global.__basedir + "/auth.json");
const settings = require(global.__basedir + "/settings.json");

module.exports = async (client) => {
  // If developer mode is on, we want to remove the commands from the test server
  if (settings.dev.active) {
    const rest = new REST({ version: "10" }).setToken(auth.token);

    await rest.put(Routes.applicationGuildCommands(client.user.id, settings.dev.guild), { body: {}})
        .catch(console.error);
  }

  // eslint-disable-next-line no-undef
  process.exit(1);
};
