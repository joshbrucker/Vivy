const executeCmd = require(__basedir + "/commands/execute-cmd.js");

module.exports = (interaction) => {
  if (!interaction.isCommand()) return;
  executeCmd(interaction.commandName, interaction);
};
