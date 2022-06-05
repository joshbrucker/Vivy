const { Permissions } = require('discord.js');
const { safeChanges } = require("@joshbrucker/discordjs-utils");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Utils, DefaultPlayOptions, DefaultPlaylistOptions, Playlist, Song } = require("discord-music-player");

const utils = require(__basedir + "/utils/utils");

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
    let voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply("You must be in voice to use this command!");
      return;
    }

    if (!voiceChannel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.VIEW_CHANNEL)) {
      await interaction.reply("I don't have permission to **view** this voice channel!");
      return;
    }

    if (!voiceChannel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.CONNECT)) {
      await interaction.reply("I don't have permission to **join** this voice channel!");
      return;
    }

    if (!voiceChannel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.SPEAK)) {
      await interaction.reply("I don't have permission to **speak** in this voice channel!");
      return;
    }

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
    let isPlaylist = utils.isPlaylist(search);
    try {
      playable = isPlaylist ?
        await Utils.playlist(search, {...DefaultPlaylistOptions, shuffle: shuffle }, queue) :
        await Utils.best(search, DefaultPlayOptions, queue);
    } finally {
      if (!playable) {
        await safeChanges.editReply(interaction, `Cannot find that ${isPlaylist ? "playlist" : "song"}!`);
        return;
      }
    }

    // try to play the playable
    let queueOptions = { index: (queue.songs && queue.songs.length > 0 && atTop) ? 0 : -1 };


    if (playable instanceof Playlist) {
      if (!playable.songs || playable.songs.length === 0) {
        await safeChanges.editReply(interaction, "Playlist is empty!");
        return;
      }

      try {
        await queue.playlist(playable, queueOptions);
        await safeChanges.editReply(interaction, `▶️  Added **${playable.name}** to the ${atTop ? "top of the " : ""}queue (${playable.songs.length} songs)!`);
      } catch (err) {
        await safeChanges.editReply(interaction, "Error playing playlist!");
      }
    } else if (playable instanceof Song) {
      try {
        await queue.play(playable, queueOptions);
        await safeChanges.editReply(interaction,
          (queue.songs && queue.songs.length === 1) ?
          `▶️  Now playing **${playable.name}**!` :
          `▶️  Added **${playable.name}** to the ${atTop ? "top of the " : ""}queue!`
        );
      } catch (err) {
        await safeChanges.editReply(interaction, "Error playing song!");
      }
    } else {
      await safeChanges.editReply(interaction, `Could not play ${isPlaylist ? "playlist" : "song"}`);
    }
  },
};
