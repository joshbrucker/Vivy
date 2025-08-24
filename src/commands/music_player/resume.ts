import { useQueue, usePlayer } from "discord-player";
import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "types";
import utils from "utils/utils";

export class ResumeCmd implements Command {
  readonly definition = new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes a paused music player.");

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

    const player = usePlayer(guild.id);
    const queue = useQueue(guild.id);

    if (!player || !queue?.currentTrack) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    if (player.isPaused()) {
      await interaction.reply("The music player is already paused!");
      return;
    }

    player.resume();

    await interaction.reply(":play_pause:  Resumed the music player!");
  }
}
