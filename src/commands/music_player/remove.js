const { SlashCommandBuilder } = require("@discordjs/builders");

const { playableToString } = require(__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Removes a song from the queue.")
    .addIntegerOption(option => option
        .setName("number")
        .setDescription("Song number to remove")
        .setRequired(true)),

  async execute(interaction) {
    let player = interaction.client.player;
    let guild = interaction.guild;
    let queue = player.getQueue(guild.id);

    if (!interaction.member.voice.channel) {
      await interaction.reply("You must be in voice to use this command!");
      return;
    }

    if (!queue || !queue.songs || queue.songs.length === 0) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    let songs = queue.songs;

    let index = interaction.options.get("number").value;
    if (index < 1 || index >= songs.length) {
      await interaction.reply("Invalid queue number!");
      return;
    }
    await interaction.reply(`⏏️  Successfully removed **[${index}] ${playableToString(songs[index])}**`);
    queue.remove(index);
  }
};
