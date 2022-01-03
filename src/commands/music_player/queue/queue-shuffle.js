module.exports = async (interaction, queue) => {
  const songs = queue.songs;

  if (songs.length <= 1) {
    await interaction.reply("There is nothing in the queue!");
    return;
  }

  queue.shuffle();
  await interaction.reply("Queue has been shuffled!");
};
