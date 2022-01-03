const { escapeMarkdown } = require(__basedir + "/utils/utils");

module.exports = async (interaction, queue) => {
  const songs = queue.songs;

  if (songs.length <= 1) {
    await interaction.reply("There is nothing in the queue!");
    return;
  }

  let index = interaction.options.get("number").value;
  if (index < 1 || index >= songs.length) {
    await interaction.reply("Invalid queue number!");
    return;
  }
  await interaction.reply(`Removed **[${index}] ${escapeMarkdown(songs[index].name)}** from the queue.`);
  queue.remove(index);
};
