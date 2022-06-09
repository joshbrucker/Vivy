const { SlashCommandBuilder } = require("@discordjs/builders");

const { escapeMarkdown } = require(__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("swap")
    .setDescription("Swaps the position of two songs in the queue.")
    .addIntegerOption(option => option
        .setName("first")
        .setDescription("First song number to remove")
        .setRequired(true))
    .addIntegerOption(option => option
        .setName("second")
        .setDescription("Second song number to remove")
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

    let first = interaction.options.get("first").value;
    let second = interaction.options.get("second").value;
    let songs = queue.songs;

    let invalidNums = [];
    if (first < 1 || first >= songs.length) invalidNums.push(first);
    if (second < 1 || second >= songs.length) invalidNums.push(second);
    if (invalidNums.length > 0) {
      await interaction.reply(`Invalid queue number${invalidNums.length > 1 ? "s" : ""}: [ **${invalidNums.join(", ")}** ]`);
      return;
    }

    let temp = songs[first];
    songs[first] = queue.songs[second];
    songs[second] = temp;

    await interaction.reply("🔄  Successfully swapped song positions in the queue!");
  }
};
