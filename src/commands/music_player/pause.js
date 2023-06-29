const { SlashCommandBuilder } = require("@discordjs/builders");
const { usePlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("pause")
      .setDescription("Pauses the music player."),

  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      await interaction.reply("You must be in voice to use this command!");
      return;
    }

    let guild = interaction.guild;
    let guildPlayerNode = usePlayer(guild.id);
    let queue = guildPlayerNode?.queue;

    if (!queue?.currentTrack) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    if (guildPlayerNode.isPaused()) {
      await interaction.reply("The music player is already paused!");
      return;
    }

    guildPlayerNode.pause();

    await interaction.reply(":pause_button:  Paused the music player!");
  }
};
