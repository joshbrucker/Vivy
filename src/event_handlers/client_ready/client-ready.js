const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");

const Commands = require(__basedir + "/commands/Commands.js");
const auth = require(__basedir + "/auth.json");

function onClientReady(client) {
  const rest = new REST({ version: "9" }).setToken(auth.token);
  const commandJSONs = Commands.map(command => command.data);

  rest.put(Routes.applicationCommands(client.user.id), { body: commandJSONs })
      .then(() => console.log("Successfully registered application commands."))
      .catch(console.error);

  console.log("I'm ready to perform~!");
}

module.exports = onClientReady;
