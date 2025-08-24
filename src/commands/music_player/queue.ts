import { PagedEmbed } from "@joshbrucker/discordjs-utils";
import { DEFAULT_OPTIONS } from "@joshbrucker/discordjs-utils/lib/paging/PagedEmbedOptions";
import { usePlayer, useQueue } from "discord-player";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  EmbedBuilder,
  ColorResolvable,
} from "discord.js";
import { images, colors } from "resources";
import { Command } from "types";
import utils from "utils/utils";

export class QueueCmd implements Command {
  readonly definition = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the queue.");

  async execute(interaction: ChatInputCommandInteraction) {
    const SONGS_PER_PAGE = 6;

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

    const player = usePlayer(guild.id);
    const queue = useQueue(guild.id);
    const currentTrack = queue?.currentTrack;

    if (!player || !currentTrack) {
      await interaction.reply("There is nothing playing!");
      return;
    }

    const tracks = queue.tracks;
    const pagedResponseData = [];
    let pageDescription = `**Now Playing**: ${utils.playableToString(
      currentTrack,
    )}\n\n`;

    if (tracks.size === 0) {
      pagedResponseData.push(generateEmbed(pageDescription));
    } else {
      for (let i = 1; i <= tracks.size; i++) {
        pageDescription += `**[${i}]**  ${utils.playableToString(
          tracks.at(i - 1)!,
        )}\n\n`;

        if (i % SONGS_PER_PAGE === 0 || i >= tracks.size) {
          pagedResponseData.push(generateEmbed(pageDescription));
          pageDescription = "";
        }
      }
    }

    await new PagedEmbed({
      ...DEFAULT_OPTIONS,
      timeout: 300000,
      wrapAround: true,
    }).send(interaction, pagedResponseData, [images.vivy]);

    function generateEmbed(description: string) {
      return new EmbedBuilder()
        .setTitle("Music Queue")
        .setDescription(description)
        .setFooter({ text: "   •   Fulfilling my mission ❤️" })
        .setThumbnail("attachment://vivy_head.png")
        .setColor(colors.vivy as ColorResolvable);
    }
  }
}
