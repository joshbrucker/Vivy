import { useQueue, usePlayer } from "discord-player";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
} from "discord.js";
import { Command } from "types";
import utils from "utils/utils";

export class SkipCmd implements Command {
  readonly definition = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the currently playing song.");

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

    player.skip();

    if (queue.size > 0) {
      await interaction.reply({
        content: `:fast_forward:  Skipping song... Now playing **${utils.playableToString(
          queue.tracks.at(0)!,
        )}**`,
        flags: [MessageFlags.SuppressEmbeds],
      });
    } else {
      await interaction.reply(
        ":fast_forward:  Skipping song... Reached end of queue!",
      );
    }
  }
}
