const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("shuffle")
      .setDescription("Shuffles the queue."),

  async execute(interaction) {
    const player = interaction.client.player;
    const guild = interaction.guild;
    const queue = player.getQueue(guild.id);

    if (!queue || !queue.isPlaying) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    queue.shuffle();
    await interaction.reply("Queue has been shuffled!");
  }
};
