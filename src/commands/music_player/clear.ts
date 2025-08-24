import { SlashCommandBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { Command } from "types";
import utils from "utils/utils";

export class ClearCmd implements Command {
  readonly definition = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears the queue.");

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

    queue.clear();

    await interaction.reply(":put_litter_in_its_place:  Cleared the queue!");
  }
}
