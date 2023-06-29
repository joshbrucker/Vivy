const { SlashCommandBuilder } = require("@discordjs/builders");
const { usePlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("clear")
      .setDescription("Clears the queue."),

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

    guildPlayerNode.queue.clear();

    await interaction.reply(":put_litter_in_its_place:  Cleared the queue!");
  }
};
