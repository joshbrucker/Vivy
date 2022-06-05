const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("pause")
      .setDescription("Pauses the music player."),

  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      await interaction.reply("You must be in voice to use this command!");
      return;
    }

    let player = interaction.client.player;
    let guild = interaction.guild;
    let queue = player.getQueue(guild.id);

    if (!queue || !queue.songs || queue.songs.length === 0) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    if (queue.paused) {
      await interaction.reply("The music player is already paused!");
      return;
    }

    await queue.setPaused(true);
    await interaction.reply("⏸️  Paused the music player!");
  }
};
