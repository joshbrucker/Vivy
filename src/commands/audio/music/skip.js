const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the currently playing song."),

  async execute(interaction) {
    let player = interaction.client.player;
    let guild = interaction.guild;

    let guildQueue = player.getQueue(guild.id);

    if (guildQueue && guildQueue.isPlaying) {
      await guildQueue.skip();
      interaction.reply("Skipping song... Now playing **" + guildQueue.songs[0] + "**");
    } else {
      interaction.reply("Nothing to skip!");
    }
  },
};
