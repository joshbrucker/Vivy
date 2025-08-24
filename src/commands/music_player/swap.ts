import { useQueue } from "discord-player";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
} from "discord.js";
import { Command } from "types";
import utils from "utils/utils";

export class SwapCmd implements Command {
  readonly definition = new SlashCommandBuilder()
    .setName("swap")
    .setDescription("Swaps the position of two songs in the queue.")
    .addIntegerOption((option) =>
      option
        .setName("first")
        .setDescription("First song number to remove")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("second")
        .setDescription("Second song number to remove")
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

    const first = interaction.options.getNumber("first", true);
    const second = interaction.options.getNumber("second", true);
    const queueSize = queue.size;

    const invalidNums = [];
    if (first < 1 || first > queueSize) invalidNums.push(first);
    if (second < 1 || second > queueSize) invalidNums.push(second);
    if (invalidNums.length > 0) {
      await interaction.reply(
        `Invalid queue number${
          invalidNums.length > 1 ? "s" : ""
        }: [ **${invalidNums.join(", ")}** ]`,
      );
      return;
    }

    queue.swapTracks(first - 1, second - 1);

    await interaction.reply({
      content: `:arrows_counterclockwise:  Swapped song positions **[${first}]**  :left_right_arrow:  **[${second}]**`,
      flags: [MessageFlags.SuppressEmbeds],
    });
  }
}
