import { REST } from "@discordjs/rest";
import auth from "auth.json";
import { CommandRegistry } from "commands/command-registry";
import { BringTopCmd } from "commands/music_player/bringtop";
import { ClearCmd } from "commands/music_player/clear";
import { PauseCmd } from "commands/music_player/pause";
import { PlayCmd } from "commands/music_player/play";
import { PlayTopCmd } from "commands/music_player/playtop";
import { QueueCmd } from "commands/music_player/queue";
import { RemoveCmd } from "commands/music_player/remove";
import { ResumeCmd } from "commands/music_player/resume";
import { ShuffleCmd } from "commands/music_player/shuffle";
import { SkipCmd } from "commands/music_player/skip";
import { StopCmd } from "commands/music_player/stop";
import { SwapCmd } from "commands/music_player/swap";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { MusicPlayer } from "music_player/music-player";
import settings from "settings.json";

export async function onClientReady(
  client: Client,
  commandRegistry: CommandRegistry,
) {
  // Set up all the commands.
  addCommandsToRegistry(commandRegistry);
  await pushCommands(client, commandRegistry);

  // Create and set the music player.
  // It can be accessed using discord-player hooks:
  // https://github.com/Androz2091/discord-player/blob/master/apps/website/content/docs/hooks/using_hooks.mdx
  await createMusicPlayer(client);

  console.log("I'm ready to perform~!");
}

function addCommandsToRegistry(commandRegistry: CommandRegistry) {
  commandRegistry
    .registerCommand("bringtop", new BringTopCmd())
    .registerCommand("clear", new ClearCmd())
    .registerCommand("pause", new PauseCmd())
    .registerCommand("play", new PlayCmd())
    .registerCommand("playtop", new PlayTopCmd())
    .registerCommand("queue", new QueueCmd())
    .registerCommand("remove", new RemoveCmd())
    .registerCommand("resume", new ResumeCmd())
    .registerCommand("shuffle", new ShuffleCmd())
    .registerCommand("skip", new SkipCmd())
    .registerCommand("stop", new StopCmd())
    .registerCommand("swap", new SwapCmd());
}

async function pushCommands(client: Client, commandRegistry: CommandRegistry) {
  const rest = new REST({ version: "10" }).setToken(auth.token);
  const commandDefinitions = commandRegistry.getCommandDefinitions();

  if (settings.dev.active) {
    await rest
      .put(
        Routes.applicationGuildCommands(client.user!.id, settings.dev.guild),
        { body: commandDefinitions },
      )
      .catch(console.error);
  } else {
    await rest
      .put(Routes.applicationCommands(client.user!.id), {
        body: commandDefinitions,
      })
      .catch(console.error);
  }
}

async function createMusicPlayer(client: Client) {
  const musicPlayer = new MusicPlayer(client);
  await musicPlayer.registerYoutubeiExtractor();

  return musicPlayer;
}
