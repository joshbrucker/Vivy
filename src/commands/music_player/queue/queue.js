const { SlashCommandBuilder } = require("@discordjs/builders");

const show = require("./queue-show");
const shuffle = require("./queue-shuffle");
const remove = require("./queue-remove");
const swap = require("./queue-swap");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("queue")
      .setDescription("Commands for managing the queue.")
      .addSubcommand(subcommand => subcommand
          .setName("show")
          .setDescription("Shows the queue."))
      .addSubcommand(subcommand => subcommand
          .setName("shuffle")
          .setDescription("Shuffles the queue."))
      .addSubcommand(subcommand => subcommand
          .setName("remove")
          .setDescription("Removes a song from the queue.")
          .addIntegerOption(option => option
              .setName("number")
              .setDescription("Queue number to remove")
              .setRequired(true)))
      .addSubcommand(subcommand => subcommand
          .setName("swap")
          .setDescription("Swaps the position of two songs in the queue.")
          .addIntegerOption(option => option
              .setName("first")
              .setDescription("First song number to remove")
              .setRequired(true))
          .addIntegerOption(option => option
              .setName("second")
              .setDescription("Second song number to remove")
              .setRequired(true))),

  async execute(interaction) {
    const player = interaction.client.player;
    const guild = interaction.guild;
    const queue = player.getQueue(guild.id);

    if (!queue || !queue.songs || queue.songs.length === 0) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    switch(interaction.options.getSubcommand()) {
      case "show": show(interaction, queue); break;
      case "shuffle": shuffle(interaction, queue); break;
      case "remove": remove(interaction, queue); break;
      case "swap": swap(interaction, queue); break;
    }
  }
};
