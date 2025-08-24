import { onClientReady } from "./client-ready";
import { onInteractionCreate } from "./interaction-create";
import { onUnhandledRejection } from "./unhandled-rejection";
import { CommandRegistry } from "commands/command-registry";
import { Client } from "discord.js";

export class EventHandler {
  private readonly client: Client;
  private readonly commandRegistry: CommandRegistry;

  constructor(client: Client, commandRegistry: CommandRegistry) {
    this.client = client;
    this.commandRegistry = commandRegistry;
  }

  listenForUnhandledRejection() {
    process.on("unhandledRejection", (error) => onUnhandledRejection(error));
  }

  listenForClientReady() {
    this.client.on("ready", () =>
      onClientReady(this.client, this.commandRegistry),
    );
  }

  listenForInteractionCreate() {
    this.client.on("interactionCreate", (interaction) =>
      onInteractionCreate(this.client, this.commandRegistry, interaction),
    );
  }
}
