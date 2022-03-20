const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");

const backId = "back";
const forwardId = "forward";

// ensures that content/embeds do not persist across pages
let generatePayload = function(data) {
  return { content: data.content || null, embeds: data.embeds || null };
};

let sendPagedResponse = async function(interaction, pageData, attachments=[], timeout=120000) {
  if (pageData.length === 1) {
    await interaction.reply({
      ...generatePayload(pageData[0]),
      files: attachments
    });
    return;
  }

  const backButton = new MessageButton({
    style: "SECONDARY",
    emoji: "◀️",
    customId: backId
  });
  const forwardButton = new MessageButton({
    style: "SECONDARY",
    emoji: "▶️",
    customId: forwardId
  });

  let embed = await interaction.reply({
    ...generatePayload(pageData[0]),
    files: attachments,
    components: pageData.length > 1 ? [new MessageActionRow({components: [forwardButton]})] : [],
    fetchReply: true
  });

  const collector = embed.createMessageComponentCollector({
    time: timeout
  });

  let currentIndex = 0;
  collector.on("collect", async buttonInteraction => {
    collector.resetTimer();

    if (buttonInteraction.customId === backId) {
      currentIndex -= 1;
    } else {
      currentIndex += 1;
    }

    await buttonInteraction.update({
      ...generatePayload(pageData[currentIndex]),
      components: [
        new MessageActionRow({
          components: [
            ...(currentIndex ? [backButton] : []),
            ...(currentIndex < pageData.length - 1 ? [forwardButton] : [])
          ]
        })
      ]
    }).catch(err => {
      if (err.message !== "Unknown Message") throw err;
    });
  });

  collector.on("end", async () => {
    backButton.disabled = true;
    forwardButton.disabled = true;

    await interaction.editReply({
      components: [
        new MessageActionRow({
          components: [
            ...(currentIndex ? [backButton] : []),
            ...(currentIndex < pageData.length - 1 ? [forwardButton] : [])
          ]
        })
      ]
    }).catch(err => {
      if (err.message !== "Unknown Message") throw err;
    });
  });
};

module.exports = sendPagedResponse;
