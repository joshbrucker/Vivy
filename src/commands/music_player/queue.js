const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const colors = require(__basedir + "/resources/colors.json");
const sendPagedResponse = require(__basedir + "/utils/paged-response");
const { escapeMarkdown } = require(__basedir + "/utils/utils");

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
    let pageDescription = `**Now Playing**: [${escapeMarkdown(songs[0].name)}](${songs[0].url})\n\n`;

    if (songs.length === 1) {
      pagedResponseData.push(generateEmbed(pageDescription));
    } else {
      for (let i = 1; i < songs.length; i++) {
        pageDescription += `**[${i}]**  [${escapeMarkdown(songs[i].name)}](${songs[i].url})\n\n`;

        if (i % SONGS_PER_PAGE === 0 || (i + 1) >= songs.length) {
          pagedResponseData.push(generateEmbed(pageDescription));
          pageDescription = "";
        }
      }
    }

    await sendPagedResponse(interaction, pagedResponseData, [__basedir + "/resources/images/vivy_head.png"]);

    function generateEmbed(description) {
      return {
        embeds:[
          new MessageEmbed()
              .setTitle(`Music Queue (${songs.length - 1} songs)`)
              .setDescription(description)
              .setFooter("\u200b\nFulfilling my mission ❤️")
              .setThumbnail("attachment://vivy_head.png")
              .setColor(colors.vivy)
        ]
      };
    }
  }
};
