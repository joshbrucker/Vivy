const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("skip")
      .setDescription("Skips the currently playing song."),

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

    await queue.skip();
    if (queue.songs.length > 1)  {
      interaction.reply(`⏩  Skipping song... Now playing **${queue.songs[1]}**`);
    } else {
      interaction.reply("⏩  Skipping song... Reached end of queue!");
    }
  }
};
