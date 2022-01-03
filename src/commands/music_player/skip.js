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

    let guildQueue = player.getQueue(guild.id);

    if (guildQueue && guildQueue.isPlaying) {
      await guildQueue.skip();
      interaction.reply("Skipping song... Now playing **" + guildQueue.songs[0] + "**");
    } else {
      interaction.reply("Nothing to skip!");
    }
  },
};
