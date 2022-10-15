const executeCmd = require(global.__basedir + "/commands/execute-cmd.js");

module.exports = (interaction) => {
  if (!interaction.isCommand()) return;
  executeCmd(interaction.commandName, interaction);
};
