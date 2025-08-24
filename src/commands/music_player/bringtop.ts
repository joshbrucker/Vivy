import { useQueue } from "discord-player";
import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "types";
import utils from "utils/utils";

export class BringTopCmd implements Command {
  readonly definition = new SlashCommandBuilder()
    .setName("bringtop")
    .setDescription("Brings a song to the top of the queue.")
    .addIntegerOption((option) =>
      option
        .setName("song_number")
        .setDescription("Song number to bring to the top of the queue")
        .setRequired(true),
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
        "Ran into an unexpected error! If this persists, please check bot permissions or contact a developer.",
      );
      return;
    }

    if (!member.voice?.channel) {
      await interaction.reply("You must be in voice to use this command!");
      return;
    }

    // Get the queue from the guild's player.
    const queue = useQueue(guild.id);

    if (!queue?.currentTrack) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    // Find the track associated with the entered song number.
    const songNumber = interaction.options.getInteger("song_number", true);

    const trackToMove = queue.tracks.at(songNumber - 1);

    if (!trackToMove) {
      await interaction.reply("Invalid queue number " + songNumber + "!");
      return;
    }

    // Move the track to location 0 in queue.
    queue.moveTrack(trackToMove, 0);

    await interaction.reply({
      content: `:arrow_up:  Brought song **[${songNumber}] ${utils.playableToString(
        trackToMove,
      )}** to the top of the queue!`,
      flags: [MessageFlags.SuppressEmbeds],
    });
  }
}
