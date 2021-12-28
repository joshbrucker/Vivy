const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const colors = require(__basedir + "/resources/colors.json");
const sendPagedResponse = require(__basedir + "/utils/paged-response");
const { escapeMarkdown } = require(__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Views the current song queue."),

  async execute(interaction) {
    const player = interaction.client.player;
    const guild = interaction.guild;
    const SONGS_PER_PAGE = 5;

    const queue = player.getQueue(guild.id);

    if (!queue) {
      await interaction.reply("There is nothing in the queue!");
      return;
    }

    let songs = queue.songs;

    let pagedResponseData = [];
    let pageText = "";
    let currentPage = generateQueueEmbed();

    for (let i = 0; i < songs.length; i++) {
      if (i % SONGS_PER_PAGE == 0 && pageText.length != 0) {
        addPage();
      }

      if (i == 0) {
        pageText += `**Now Playing**: [${escapeMarkdown(songs[i].name)}](${songs[i].url})\n\n`;
      } else {
        pageText += `**[${i}]**  [${escapeMarkdown(songs[i].name)}](${songs[i].url})\n\n`;
      }
    }

    if (pageText.length != 0) {
      addPage();
    }

    await sendPagedResponse(interaction, pagedResponseData, global.pagingTimeout);

    function addPage() {
      currentPage.setDescription(pageText);
      pagedResponseData.push({ embeds: [currentPage], files: [__basedir + "/resources/images/vivy_head.png"] });
      pageText = "";
      currentPage = generateQueueEmbed();
    }

    function generateQueueEmbed() {
      return new MessageEmbed()
          .setTitle("Music Queue")
          .setFooter("\u200b\nFulfilling my mission ❤️")
          .setThumbnail("attachment://vivy_head.png")
          .setColor(colors.vivy);
    }
  }
};
