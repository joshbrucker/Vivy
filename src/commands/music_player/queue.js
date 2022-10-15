const { MessageEmbed } = require("discord.js");
const { PagedEmbed } = require("@joshbrucker/discordjs-utils");
const { SlashCommandBuilder } = require("@discordjs/builders");

const colors = require(global.__basedir + "/resources/colors.json");
const { playableToString } = require(global.__basedir + "/utils/utils.js");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("queue")
      .setDescription("Shows the queue."),

  async execute(interaction) {
    const SONGS_PER_PAGE = 6;

    let player = interaction.client.player;
    let guild = interaction.guild;
    let queue = player.getQueue(guild.id);

    if (!queue || !queue.songs || queue.songs.length === 0) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    let songs = queue.songs;

    let pagedResponseData = [];
    let pageDescription = `**Now Playing**: ${playableToString(songs[0])}\n\n`;

    if (songs.length === 1) {
      pagedResponseData.push(generateEmbed(pageDescription));
    } else {
      for (let i = 1; i < songs.length; i++) {
        pageDescription += `**[${i}]**  ${playableToString(songs[i])}\n\n`;

        if (i % SONGS_PER_PAGE === 0 || (i + 1) >= songs.length) {
          pagedResponseData.push(generateEmbed(pageDescription));
          pageDescription = "";
        }
      }
    }

    await new PagedEmbed({ timeout: 300000 }).send(interaction, pagedResponseData, [ global.__basedir + "/resources/images/vivy_head.png" ]);

    function generateEmbed(description) {
      return new MessageEmbed()
          .setTitle("Music Queue")
          .setDescription(description)
          .setFooter({ text: "   •   Fulfilling my mission ❤️" })
          .setThumbnail("attachment://vivy_head.png")
          .setColor(colors.vivy);
    }
  }
};
