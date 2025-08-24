import { Playlist, Track } from "discord-player";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export function escapeMarkdown(text: string) {
  return text.replace(/((_|\*|~|`|\|){2})/g, "\\$1");
}

export function getMonthName(num: number) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    return months[num - 1];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error("Invalid month number! Valid range is 1-12.");
  }
}

export function playableToString(
  playable: Track | Playlist,
  includeLink: boolean = true,
) {
  if (includeLink && playable.url) {
    return `[${escapeMarkdown(playable.title)}](${playable.url})`;
  }

  return escapeMarkdown(playable.title);
}

export async function random(num: number) {
  return Math.floor(Math.random() * num);
}

export async function fetchMemberFromInteraction(
  interaction: ChatInputCommandInteraction,
) {
  const guild = interaction.guild;
  if (!guild) {
    return;
  }

  let guildMember;
  if (interaction.member instanceof GuildMember) {
    guildMember = interaction.member;
  } else if (interaction.member) {
    guildMember = await guild.members.fetch(interaction.member.user.id);
  }

  return guildMember;
}

export async function shuffleArray(array: Array<unknown>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default {
  escapeMarkdown,
  getMonthName,
  random,
  playableToString,
  fetchMemberFromInteraction,
  shuffleArray,
};
