const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const colors = require(__basedir + "/resources/colors.json");
const sendPagedResponse = require(__basedir + "/utils/paged-response");
const { escapeMarkdown } = require(__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("queue")
      .setDescription("Views the current song queue.")
      .addSubcommand(subcommand => subcommand
          .setName("show")
          .setDescription("Shows the queue"))
      .addSubcommand(subcommand => subcommand
          .setName("remove")
          .setDescription("Remove a song from the queue.")
          .addIntegerOption(option => option
              .setName("number")
              .setDescription("Queue number to remove"))),

  async execute(interaction) {
    const player = interaction.client.player;
    const guild = interaction.guild;
    const SONGS_PER_PAGE = 5;

    const queue = player.getQueue(guild.id);

    if (!queue) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    let songs = queue.songs;

    // show subcommand
    if (interaction.options.getSubcommand() === "show") {
      let pagedResponseData = [];
      let pageText = "";
      let currentPage = generateQueueEmbed();

      for (let i = 0; i < songs.length; i++) {
        if (i % SONGS_PER_PAGE == 0 && pageText.length != 0) {
          addPage();
        }

        if (i === 0) {
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

    // remove subcommand
    if (interaction.options.getSubcommand() === "remove") {
      if (songs.length === 1) {
        await interaction.reply("There is nothing to remove from the queue!");
        return;
      }

      let index = interaction.options.get("number").value;
      if (index < 1 || index >= songs.length) {
        await interaction.reply("Invalid queue number!");
        return;
      }
      await interaction.reply(`Removed **[${index}] ${escapeMarkdown(songs[index].name)}** from the queue.`);
      queue.remove(index);
      return;
    }
  }
};
