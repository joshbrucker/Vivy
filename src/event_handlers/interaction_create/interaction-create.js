const executeCmd = require(__basedir + "/commands/execute-cmd.js");

async function interactionCreate(client, interaction) {
    if (!interaction.isCommand()) return;
    executeCmd(interaction.commandName, interaction);
}

module.exports = interactionCreate;
