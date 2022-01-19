const { escapeMarkdown } = require(__basedir + "/utils/utils");

module.exports = async (interaction, queue) => {
  const first = interaction.options.get("first").value;
  const second = interaction.options.get("second").value;
  const songs = queue.songs;

  if (songs.length <= 1) {
    await interaction.reply("There is nothing in the queue!");
    return;
  }

  let invalidNums = [];
  if (first < 1 || first >= songs.length) invalidNums.push(first);
  if (second < 1 || second >= songs.length) invalidNums.push(second);
  if (invalidNums.length > 0) {
    await interaction.reply(`Invalid queue number${invalidNums.length > 1 ? "s" : ""}: [ **${invalidNums.join(", ")}** ]`);
    return;
  }

  let temp = queue.songs[first];
  queue.songs[first] = queue.songs[second];
  queue.songs[second] = temp;

  await interaction.reply("Successfully swapped songs!");
};
