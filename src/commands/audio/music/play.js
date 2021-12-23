const { SlashCommandBuilder } = require("@discordjs/builders");
const { Utils, DefaultPlayOptions, Playlist, Song } = require("discord-music-player");
const isUrl = require("is-url");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Searches for a song or playlist plays it in voice.")
    .addStringOption(option =>
      option.setName("search")
        .setDescription("The song or playlist name that you want to search for.")
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    let search = interaction.options.get("search").value;
    let player = interaction.client.player;
    let guild = interaction.guild;

    let queue = player.getQueue(guild.id);
    if (!queue) {
      queue = player.createQueue(guild.id);
    }

    await queue.join(interaction.member.voice.channel);

    // search for a playable, given a search query
    let playable;
    try {
      if (isUrl(search)) {
        if (search.includes("&list=")) {
          playable = await Utils.playlist(search, DefaultPlayOptions, queue);
        } else {
          console.log(search);
          playable = await Utils.link(search, DefaultPlayOptions, queue);
          console.log(playable);
        }
      } else {
        playable = (await Utils.search(search, DefaultPlayOptions, queue))[0];
      }
    } catch (ex) {
      console.log(ex);
      await interaction.editReply("Cannot find that song/playlist!");
      return;
    }

    // try to play the playable
    if (playable) {
      if (queue.isPlaying || playable instanceof Playlist) {
        let songCount = (playable.songs) ? " (" + playable.songs.length + " songs)" : "";
        await interaction.editReply("Adding **" + playable.name + "** to the queue" + songCount);
      } else {
        await interaction.editReply("Now playing **" + playable.name + "**!");
      }

      if (playable instanceof Playlist) {
        await queue.playlist(playable).catch(_ => {
          interaction.editReply("Error playing playlist!");
        });
      } else if (playable instanceof Song) {
        await queue.play(playable).catch(_ => {
          interaction.editReply("Error playing song!");
        });
      }
    } else {
      await interaction.editReply("Cannot find that song/playlist!");
    }
  },
};
