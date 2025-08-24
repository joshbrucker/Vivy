import { CommandRegistry } from "commands/command-registry";
import { Client, Interaction } from "discord.js";

export async function onInteractionCreate(
  client: Client,
  commandRegistry: CommandRegistry,
  interaction: Interaction,
) {
  if (!interaction.isCommand()) {
    return;
  }

  await commandRegistry.executeCommand(interaction.commandName, interaction);
}
