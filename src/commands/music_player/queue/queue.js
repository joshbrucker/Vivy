const { SlashCommandBuilder } = require("@discordjs/builders");

const show = require("./queue-show");
const remove = require("./queue-remove");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("queue")
      .setDescription("Views the current song queue.")
      .addSubcommand(subcommand => subcommand
          .setName("show")
          .setDescription("Shows the queue"))
      .addSubcommand(subcommand => subcommand
          .setName("remove")
          .setDescription("Remove a song from the queue.")
          .addIntegerOption(option => option
              .setName("number")
              .setDescription("Queue number to remove"))),

  async execute(interaction) {
    const player = interaction.client.player;
    const guild = interaction.guild;

    const queue = player.getQueue(guild.id);

    if (!queue) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    switch(interaction.options.getSubcommand()) {
      case "show": show(interaction, queue); break;
      case "remove": remove(interaction, queue); break;
    }
  }
};
