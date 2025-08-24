import { CommandInteraction } from "discord.js";
import { Command, SlashCommandDefinition } from "types";

export class CommandRegistry {
  commandMap: Map<string, Command>;

  constructor() {
    this.commandMap = new Map();
  }

  /**
   * Command to register commands in the map. Returns self so that
   * multiple registerCommand() calls can be chained easily.
   */
  registerCommand(name: string, command: Command): CommandRegistry {
    this.commandMap.set(name, command);
    return this;
  }

  async executeCommand(name: string, interaction: CommandInteraction) {
    const command = this.commandMap.get(name);
    if (command) {
      command.execute(interaction);
    } else {
      await interaction.reply(
        "Command definition not found... Please contact a developer.",
      );
    }
  }

  getCommandDefinitions(): Array<SlashCommandDefinition> {
    const commands = [...this.commandMap.values()];
    return commands.map((command) => command.definition);
  }
}
