// eslint-disable-next-line no-undef
global.__basedir = __dirname;

const Discord = require("discord.js");
const { GatewayIntentBits } = require("discord-api-types/gateway/v10");

const eventHandler = require("./event_handlers/event-handler.js");
const auth = require("./auth.json");


const client = new Discord.Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildVoiceStates
]});

// eslint-disable-next-line no-undef
process.on("unhandledRejection", (error) => eventHandler.onUnhandledRejection(error));

// eslint-disable-next-line no-undef
// process.on("SIGINT", async () => await eventHandler.onProcessClose(client));

// Set client event handlers
client.on("ready", () => eventHandler.onClientReady(client));
client.on("interactionCreate", (interaction) => eventHandler.onInteractionCreate(interaction));

client.login(auth.token);
