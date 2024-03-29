const { SlashCommandBuilder } = require("@discordjs/builders");
const { usePlayer } = require("discord-player");
const { MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("swap")
      .setDescription("Swaps the position of two songs in the queue.")
      .addIntegerOption(option => option
          .setName("first")
          .setDescription("First song number to remove")
          .setRequired(true))
      .addIntegerOption(option => option
          .setName("second")
          .setDescription("Second song number to remove")
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

    let first = interaction.options.get("first").value;
    let second = interaction.options.get("second").value;
    let queueSize = queue.size;

    let invalidNums = [];
    if (first < 1 || first > queueSize) invalidNums.push(first);
    if (second < 1 || second > queueSize) invalidNums.push(second);
    if (invalidNums.length > 0) {
      await interaction.reply(`Invalid queue number${invalidNums.length > 1 ? "s" : ""}: [ **${invalidNums.join(", ")}** ]`);
      return;
    }

    queue.swapTracks(first - 1, second - 1);

    await interaction.reply({
      content: `:arrows_counterclockwise:  Swapped song positions **[${first}]**  :left_right_arrow:  **[${second}]**`,
      flags: [ MessageFlags.SuppressEmbeds ]
    });
  }
};
