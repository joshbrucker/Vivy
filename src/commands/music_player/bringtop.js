const { SlashCommandBuilder } = require("@discordjs/builders");
const { usePlayer } = require("discord-player");
const { MessageFlags } = require("discord.js");

const utils = require(global.__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("bringtop")
      .setDescription("Brings a song to the top of the queue.")
      .addIntegerOption(option => option
          .setName("song_number")
          .setDescription("Song number to bring to the top of the queue")
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

    let songNumber = interaction.options.get("song_number").value;
    let queueSize = queue.size;

    let invalidNums = [];
    if (songNumber < 1 || songNumber > queueSize) {
      invalidNums.push(songNumber);
    }

    if (invalidNums.length > 0) {
      await interaction.reply(`Invalid queue number${invalidNums.length > 1 ? "s" : ""}: [ **${invalidNums.join(", ")}** ]`);
      return;
    }

    let trackToMove = queue.tracks.at(songNumber - 1);
    queue.moveTrack(trackToMove, 0);

    await interaction.reply({
      content: `:arrow_up:  Brought song **[${songNumber}] ${utils.playableToString(trackToMove)}** to the top of the queue!`,
      flags: [ MessageFlags.SuppressEmbeds ]
    });
  }
};
