const { SlashCommandBuilder } = require("@discordjs/builders");
const { usePlayer } = require("discord-player");
const { MessageFlags } = require("discord.js");

const { playableToString } = require(global.__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("remove")
      .setDescription("Removes a song from the queue.")
      .addIntegerOption(option => option
          .setName("number")
          .setDescription("Song number to remove")
          .setRequired(true)),

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

    let index = interaction.options.get("number").value;
    if (index < 1 || index >= queue.size) {
      await interaction.reply("Invalid queue number!");
      return;
    }

    let removedTrack = queue.removeTrack(index - 1);

    await interaction.reply({ content: `:eject:  Removed **[${index}] ${playableToString(removedTrack)}**`, flags: [ MessageFlags.SuppressEmbeds ]});
  }
};
