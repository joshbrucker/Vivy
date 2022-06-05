const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("resume")
      .setDescription("Resumes a paused music player."),

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

    if (!queue.paused) {
      await interaction.reply("The music player is already resumed!");
      return;
    }

    await queue.setPaused(false);
    await interaction.reply("⏯️  Resumed the music player!");
  }
};
