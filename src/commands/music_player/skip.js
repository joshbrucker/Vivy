const { SlashCommandBuilder } = require("@discordjs/builders");
const { usePlayer } = require("discord-player");
const { MessageFlags } = require("discord.js");

const utils = require(global.__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("skip")
      .setDescription("Skips the currently playing song."),

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

    let initialQueueSize = queue.size;

    guildPlayerNode.skip();

    if (initialQueueSize > 0)  {
      await interaction.reply({
        content: `:fast_forward:  Skipping song... Now playing **${utils.playableToString(queue.tracks.at(0))}**`,
        fetchReply: true,
        flags: [ MessageFlags.SuppressEmbeds ]
      });
    } else {
      await interaction.reply(":fast_forward:  Skipping song... Reached end of queue!");
    }
  }
};
