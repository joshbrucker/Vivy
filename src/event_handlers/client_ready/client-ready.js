const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");

const Commands = require(__basedir + "/commands/Commands.js");
const auth = require(__basedir + "/auth.json");

module.exports = (client) => {
  const rest = new REST({ version: "10" }).setToken(auth.token);
  const commandJSONs = Commands.map(command => command.data);

  rest.put(Routes.applicationCommands(client.user.id), { body: commandJSONs })
      .catch(console.error);

  console.log("I'm ready to perform~!");
};
