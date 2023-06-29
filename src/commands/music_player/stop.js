const { SlashCommandBuilder } = require("@discordjs/builders");
const { usePlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("stop")
      .setDescription("Stops the music player and clears the queue."),

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

    await interaction.reply(":stop_button:  Stopped the music player!");
    guildPlayerNode.stop();
  }
};
