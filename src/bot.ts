import { GatewayIntentBits } from "discord-api-types/gateway/v10";
import { Client } from "discord.js";

import auth from "auth.json";
import { CommandRegistry } from "commands/command-registry";
import { EventHandler } from "event_handlers/event-handler";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const commandRegistry = new CommandRegistry();

const eventHandler = new EventHandler(client, commandRegistry);
eventHandler.listenForUnhandledRejection();
eventHandler.listenForClientReady();
eventHandler.listenForInteractionCreate();

client.login(auth.token);
