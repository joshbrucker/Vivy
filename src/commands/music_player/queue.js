const { PagedEmbed } = require("@joshbrucker/discordjs-utils");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { usePlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

const colors = require(global.__basedir + "/resources/colors.json");
const { playableToString } = require(global.__basedir + "/utils/utils.js");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("queue")
      .setDescription("Shows the queue."),

  async execute(interaction) {
    const SONGS_PER_PAGE = 6;

    let guild = interaction.guild;
    let guildPlayerNode = usePlayer(guild.id);
    let queue = guildPlayerNode?.queue;

    let currentTrack = queue?.currentTrack;

    if (!queue?.currentTrack) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    let tracks = queue.tracks;
    let pagedResponseData = [];
    let pageDescription = `**Now Playing**: ${playableToString(currentTrack)}\n\n`;

    if (tracks.size === 0) {
      pagedResponseData.push(generateEmbed(pageDescription));
    } else {
      for (let i = 1; i <= tracks.size; i++) {
        pageDescription += `**[${i}]**  ${playableToString(tracks.at(i - 1))}\n\n`;

        if (i % SONGS_PER_PAGE === 0 || i >= tracks.size) {
          pagedResponseData.push(generateEmbed(pageDescription));
          pageDescription = "";
        }
      }
    }

    await new PagedEmbed({ timeout: 300000, wrapAround: true }).send(interaction, pagedResponseData, [ global.__basedir + "/resources/images/vivy_head.png" ]);

    function generateEmbed(description) {
      return new EmbedBuilder()
          .setTitle("Music Queue")
          .setDescription(description)
          .setFooter({ text: "   •   Fulfilling my mission ❤️" })
          .setThumbnail("attachment://vivy_head.png")
          .setColor(colors.vivy);
    }
  }
};
