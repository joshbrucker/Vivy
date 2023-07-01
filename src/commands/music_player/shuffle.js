const { SlashCommandBuilder } = require("@discordjs/builders");
const { usePlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("shuffle")
      .setDescription("Shuffles the queue."),

  async execute(interaction) {
    let guild = interaction.guild;
    let guildPlayerNode = usePlayer(guild.id);
    let queue = guildPlayerNode?.queue;

    if (!queue?.currentTrack) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    queue.tracks.shuffle();

    await interaction.reply(":twisted_rightwards_arrows:  Queue has been shuffled!");
  }
};
