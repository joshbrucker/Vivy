const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");

const backId = 'back';
const forwardId = 'forward';

// ensures that content/embeds do not persist
let generatePayload = function(data) {
  let { content, embeds } = data;
  return { content: content || null, embeds: embeds || null };
}

let sendPagedResponse = async function(interaction, pageData, attachments=[], timeout=120000) {
  if (pageData.length === 1) {
    await interaction.reply({...generatePayload(pageData[0])});
    return;
  }

  const backButton = new MessageButton({
    style: 'SECONDARY',
    emoji: '◀️',
    customId: backId
  });
  const forwardButton = new MessageButton({
    style: 'SECONDARY',
    emoji: '▶️',
    customId: forwardId
  });

  let embed = await interaction.reply({
    ...generatePayload(pageData[0]),
    files: attachments,
    components: [new MessageActionRow({components: [forwardButton]})],
    fetchReply: true
  });

  const collector = embed.createMessageComponentCollector({
    time: timeout
  })

  let currentIndex = 0
  collector.on("collect", async interaction => {
    collector.resetTimer();

    interaction.customId === backId ? (currentIndex -= 1) : (currentIndex += 1)
    await interaction.update({
      ...generatePayload(pageData[currentIndex]),
      components: [
        new MessageActionRow({
          components: [
            ...(currentIndex ? [backButton] : []),
            ...(currentIndex < pageData.length - 1 ? [forwardButton] : [])
          ]
        })
      ]
    });
  })

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
    });
  });
}

module.exports = sendPagedResponse;
