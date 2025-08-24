import { SlashCommandBuilder } from "@discordjs/builders";
import { useMainPlayer, useQueue } from "discord-player";
import {
  PermissionsBitField,
  MessageFlags,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import settings from "settings.json";
import { Command } from "types";
import utils from "utils/utils";

export class PlayCmd implements Command {
  readonly definition = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Searches for a song or playlist plays it in voice.")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription(
          "The song or playlist name that you want to search for.",
        )
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName("shuffle")
        .setDescription(
          "Only applies to playlists. Shuffles the playlist when adding to the queue.",
        )
        .setRequired(false),
    );

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply("Command can only be used in a guild!");
      return;
    }

    const member: GuildMember | undefined =
      await utils.fetchMemberFromInteraction(interaction);
    const me = guild.members.me;

    // If we cannot find the member who called or the bot member itself.
    if (!member || !me) {
      await interaction.reply(
        "Ran into an unexpected error! If this persists, contact a developer.",
      );
      return;
    }

    if (!member.voice?.channel) {
      await interaction.reply("You must be in voice to use this command!");
      return;
    }

    const voiceChannel = member.voice.channel;

    // Confirm view voice channel permissions.
    if (
      !voiceChannel
        .permissionsFor(me)
        .has(PermissionsBitField.Flags.ViewChannel)
    ) {
      await interaction.reply(
        "I don't have permission to **view** this voice channel!",
      );
      return;
    }

    // Confirm join voice channel permissions.
    if (
      !voiceChannel.permissionsFor(me).has(PermissionsBitField.Flags.Connect)
    ) {
      await interaction.reply(
        "I don't have permission to **join** this voice channel!",
      );
      return;
    }

    // Confirm speak voice channel permissions.
    if (!voiceChannel.permissionsFor(me).has(PermissionsBitField.Flags.Speak)) {
      await interaction.reply(
        "I don't have permission to **speak** in this voice channel!",
      );
      return;
    }

    const searchQuery = interaction.options.getString("search", true);
    const shuffle = interaction.options.getBoolean("shuffle") ?? false;

    const mainPlayer = useMainPlayer();
    if (!mainPlayer) {
      await interaction.reply(
        "Issue finding music player. If this persists, please contact a developer.",
      );
      return;
    }

    // Defer reply because our call may take some time.
    await interaction.deferReply();

    const searchResult = await mainPlayer.search(searchQuery).catch(() => null);
    if (!searchResult || searchResult.isEmpty()) {
      await interaction.editReply(`No search results for ${searchQuery}!`);
      return;
    }

    // Shuffle playlist tracks before adding to queue, if requested
    if (searchResult.playlist && shuffle) {
      const playlist = searchResult.playlist;
      const tracks = playlist.tracks;
      utils.shuffleArray(tracks);
      playlist.tracks = tracks;
    }

    const { track } = await mainPlayer.play(voiceChannel, searchResult, {
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
          timestamp: interaction.createdTimestamp,
        },
      },
    });

    const queue = useQueue(guild.id);

    let message;
    if (searchResult.playlist) {
      // If adding a playlist, include playlist name and length in reply
      const playlist = searchResult.playlist;
      message = `:ballot_box:  Added **${utils.playableToString(
        playlist,
      )}** to the queue (${playlist.tracks.length} songs)`;
    } else {
      // If queue is empty, song is currently playing, otherwise, it's been added to the queue
      if (queue!.size === 0) {
        message = `:arrow_forward:  Now playing **${utils.playableToString(
          track,
        )}**`;
      } else {
        message = `:ballot_box:  Added **${utils.playableToString(
          track,
        )}** to the queue`;
      }
    }

    await interaction.editReply({
      content: message,
      flags: [MessageFlags.SuppressEmbeds],
    });
  }
}
