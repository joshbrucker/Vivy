const { SlashCommandBuilder } = require("@discordjs/builders");
const { Utils, DefaultPlayOptions, DefaultPlaylistOptions, Playlist, Song } = require("discord-music-player");
const isUrl = require("is-url");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Searches for a song or playlist plays it in voice.")
      .addStringOption(option => option
          .setName("search")
          .setDescription("The song or playlist name that you want to search for.")
          .setRequired(true))
      .addBooleanOption(option => option
          .setName("top")
          .setDescription("Whether the song should be added to the top of the queue.")
          .setRequired(false))
      .addBooleanOption(option => option
          .setName("shuffle")
          .setDescription("Only applies to playlists. Shuffles the playlist when adding to the queue.")
          .setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply();

    let search = interaction.options.get("search").value;
    let atTop = interaction.options.get("top") ? interaction.options.get("top").value : false;
    let shuffle = interaction.options.get("shuffle") ? interaction.options.get("shuffle").value : false;

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
          playable = await Utils.playlist(search, {...DefaultPlaylistOptions, shuffle: shuffle }, queue);
        } else {
          playable = await Utils.link(search, DefaultPlayOptions, queue);
        }
      } else {
        playable = (await Utils.search(search, DefaultPlayOptions, queue))[0];
      }
    } catch (ex) {
      await interaction.editReply("Cannot find that song/playlist!");
      return;
    }

    // try to play the playable
    let queueOptions = { index: queue.isPlaying && atTop ? 0 : -1};

    if (playable) {
      if (playable instanceof Playlist) {
        await queue.playlist(playable, queueOptions).catch(_ => {
          interaction.editReply("Error playing playlist!");
        });
        await interaction.editReply(`Added **${playable.name}** to the ${atTop ? "top of the " : ""}queue (${playable.songs.length} songs)!`);
      } else {
        await queue.play(playable, queueOptions).catch(_ => {
          interaction.editReply("Error playing song!");
        });

        await interaction.editReply(
          queue.isPlaying ?
          `Added **${playable.name}** to the ${atTop ? "top of the " : ""}queue!` :
          `Now playing **${playable.name}"**!`
        );
      }
    } else {
      await interaction.editReply("Cannot find that song/playlist!");
    }
  },
};
