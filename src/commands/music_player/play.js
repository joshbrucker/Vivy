const { RESTJSONErrorCodes: { UnknownMessage }} = require("discord-api-types/rest/v10");
const { PermissionsBitField, MessageFlags } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");
const { ignore } = require("@joshbrucker/discordjs-utils");

const settings = require(global.__basedir + "/settings.json");
const utils = require(global.__basedir + "/utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Searches for a song or playlist plays it in voice.")
      .addStringOption(option => option
          .setName("search")
          .setDescription("The song or playlist name that you want to search for.")
          .setRequired(true))
      .addBooleanOption(option => option
          .setName("shuffle")
          .setDescription("Only applies to playlists. Shuffles the playlist when adding to the queue.")
          .setRequired(false)),

  async execute(interaction) {
    let voiceChannel = interaction.member.voice?.channel;
    if (!voiceChannel) {
      await interaction.reply("You must be in voice to use this command!");
      return;
    }

    if (!voiceChannel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ViewChannel)) {
      await interaction.reply("I don't have permission to **view** this voice channel!");
      return;
    }

    if (!voiceChannel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) {
      await interaction.reply("I don't have permission to **join** this voice channel!");
      return;
    }

    if (!voiceChannel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) {
      await interaction.reply("I don't have permission to **speak** in this voice channel!");
      return;
    }

    try {
      await interaction.deferReply();
    } catch (err) {
      // If the interaction fails being deferred... just abort
      return;
    }

    let searchQuery = interaction.options.get("search").value;
    let shuffle = interaction.options.get("shuffle") ? interaction.options.get("shuffle").value : false;
    let guild = interaction.guild;

    let player = interaction.client.player;

    let searchResult = await player.search(searchQuery).catch(() => null);
    if (!searchResult || searchResult.isEmpty()) {
      await interaction.editReply(`No search results for ${searchQuery}!`).catch(ignore([ UnknownMessage ]));
      return;
    }

    // Shuffle playlist tracks before adding to queue, if requested
    if (searchResult.hasPlaylist() && shuffle) {
      let playlist = searchResult.playlist;
      let tracks = playlist.tracks;
      for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ tracks[i], tracks[j] ] = [ tracks[j], tracks[i] ];
      }

      playlist.tracks = tracks;
    }

    const { track } = await player.play(
      voiceChannel,
      searchResult,
      {
        requestedBy: interaction.user,
        nodeOptions: {
          leaveOnEnd: settings.guildPlayerNode.leaveOnEnd,
          leaveOnEndCooldown: settings.guildPlayerNode.leaveOnEndCooldown,
          leaveOnEmpty: settings.guildPlayerNode.leaveOnEmpty,
          leaveOnEmptyCooldown: settings.guildPlayerNode.leaveOnEmptyCooldown,
          volume: 100,
          metadata: {
            channel: voiceChannel,
            interaction: interaction,
            timestamp: interaction.createdTimestamp
          }
        }
      }
    );

    let queue = useQueue(guild.id);

    let message;
    if (searchResult.hasPlaylist()) {
      // If adding a playlist, include playlist name and length in reply
      let playlist = searchResult.playlist;
      message = `:ballot_box:  Added **${utils.playableToString(playlist)}** to the queue (${playlist.tracks.length} songs)`;
    } else {
      // If queue is empty, song is currently playing, otherwise, it's been added to the queue
      if (queue.size === 0) {
        message = `:arrow_forward:  Now playing **${utils.playableToString(track)}**`;
      } else {
        message = `:ballot_box:  Added **${utils.playableToString(track)}** to the queue`;
      }
    }

    await interaction.editReply({
      content: message,
      flags: [ MessageFlags.SuppressEmbeds ]
    }).catch(ignore([ UnknownMessage ]));
  },
};
