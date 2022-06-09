global.__basedir = __dirname;

const Discord = require("discord.js");

const eventHandler = require("./event_handlers/event-handler.js");
const createMusicPlayer = require("./music_player/create-music-player.js");
const auth = require("./auth.json");

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"] });

client.player = createMusicPlayer(client);

// Set client event handlers
client.on("ready", () => eventHandler.onClientReady(client));
client.on("interactionCreate", (interaction) => eventHandler.onInteractionCreate(client, interaction));

client.login(auth.token);
