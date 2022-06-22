const { Permissions, Constants: { APIErrors: { UNKNOWN_MESSAGE }}} = require("discord.js");
const { ignore } = require("@joshbrucker/discordjs-utils");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Utils, DefaultPlayOptions, DefaultPlaylistOptions, Playlist, Song } = require("discord-music-player");

const utils = require(__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("playtop")
      .setDescription("Searches for a song or playlist and inserts it at the top of the queue.")
      .addStringOption(option => option
          .setName("search")
          .setDescription("The song or playlist name that you want to search for.")
          .setRequired(true))
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

    try {
      await interaction.deferReply();
    } catch (err) {
      // if the interaction fails being deferred, just abort (most likely it was deleted)
      return;
    }

    let search = interaction.options.get("search").value;
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
        await interaction.editReply(`Cannot find that ${isPlaylist ? "playlist" : "song"}!`).catch(ignore([UNKNOWN_MESSAGE]));
        return;
      }
    }

    // try to play the playable
    let queueOptions = { index: (queue.songs && queue.songs.length > 0) ? 0 : -1 };

    if (playable instanceof Playlist) {
      if (!playable.songs || playable.songs.length === 0) {
        await interaction.editReply("Playlist is empty!").catch(ignore([UNKNOWN_MESSAGE]));
        return;
      }

      try {
        await queue.playlist(playable, queueOptions);
      } catch (err) {
        await interaction.editReply("Error playing playlist!").catch(ignore([UNKNOWN_MESSAGE]));
        return;
      }

      let editedMessage = await interaction.editReply(`🗳️  Added **${utils.playableToString(playable)}** to the top of the queue (${playable.songs.length} songs)!`).catch(ignore([UNKNOWN_MESSAGE]));
      if (editedMessage) {
        await editedMessage.suppressEmbeds(true).catch(ignore([UNKNOWN_MESSAGE]));
      }

      if (queue.songs.length === playable.songs.length) {
        let followUp = await interaction.followUp(`▶️  Now playing **${utils.playableToString(queue.songs[0])}**!`).catch(ignore([UNKNOWN_MESSAGE]));
        if (followUp) {
          await followUp.suppressEmbeds(true).catch(ignore([UNKNOWN_MESSAGE]));
        }
      }
    } else if (playable instanceof Song) {
      try {
        await queue.play(playable, queueOptions);
      } catch (err) {
        await interaction.editReply("Error playing song!").catch(ignore([UNKNOWN_MESSAGE]));
        return;
      }

      let editedMessage = await interaction.editReply(
        (queue.songs && queue.songs.length === 1) ? 
            `▶️  Now playing **${utils.playableToString(playable)}**!` :
            `🗳️  Added **${utils.playableToString(playable)}** to the top of the queue!`).catch(ignore([UNKNOWN_MESSAGE]));
      if (editedMessage) {
        await editedMessage.suppressEmbeds(true).catch(ignore([UNKNOWN_MESSAGE]));
      }
    } else {
      await interaction.editReply(`Could not play ${isPlaylist ? "playlist" : "song"}`).catch(ignore([UNKNOWN_MESSAGE]));
    }
  },
};
