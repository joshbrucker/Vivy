import { useQueue } from "discord-player";
import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "types";
import utils from "utils/utils";

export class RemoveCmd implements Command {
  readonly definition = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Removes a song from the queue.")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("Song number to remove from queue")
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

    const queue = useQueue(guild.id);

    if (!queue?.currentTrack) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    const index = interaction.options.getInteger("number", true);
    if (index < 1 || index > queue.size) {
      await interaction.reply("Invalid queue number!");
      return;
    }

    const removedTrack = queue.removeTrack(index - 1);

    await interaction.reply({
      content: `:eject:  Removed **[${index}] ${utils.playableToString(
        removedTrack!,
      )}**`,
      flags: [MessageFlags.SuppressEmbeds],
    });
  }
}
