let Commands = require("./Commands.js");

let executeCmd = function(name, interaction) {
  let command = Commands.get(name);
  if (command) {
    command.execute(interaction);
  }
};

module.exports = executeCmd;