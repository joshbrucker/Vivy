const { SlashCommandBuilder } = require("@discordjs/builders");

const { escapeMarkdown } = require(__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Removes a song from the queue.")
    .addIntegerOption(option => option
        .setName("number")
        .setDescription("Song number to remove")
        .setRequired(true)),

  async execute(interaction) {
    const player = interaction.client.player;
    const guild = interaction.guild;
    const queue = player.getQueue(guild.id);

    if (!queue || !queue.isPlaying) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    let songs = queue.songs;

    let index = interaction.options.get("number").value;
    if (index < 1 || index >= songs.length) {
      await interaction.reply("Invalid queue number!");
      return;
    }
    await interaction.reply(`Successfully removed **[${index}] ${escapeMarkdown(songs[index].name)}**`);
    queue.remove(index);
  }
};
