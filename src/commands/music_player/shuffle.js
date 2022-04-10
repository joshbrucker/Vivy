const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("shuffle")
      .setDescription("Shuffles the queue."),

  async execute(interaction) {
    let player = interaction.client.player;
    let guild = interaction.guild;
    let queue = player.getQueue(guild.id);

    if (!queue || !queue.songs || queue.songs.length === 0) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    queue.shuffle();
    await interaction.reply("Queue has been shuffled!");
  }
};
