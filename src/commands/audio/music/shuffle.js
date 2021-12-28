const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("shuffle")
      .setDescription("Shuffles the queue."),

  async execute(interaction) {
    let player = interaction.client.player;
    let guild = interaction.guild;

    let queue = player.getQueue(guild.id);

    if (queue && queue.songs.length > 1) {
      queue.shuffle();
      interaction.reply("Shuffling the queue...");
    } else {
      interaction.reply("No songs in the queue to shuffle!");
    }
  },
};
