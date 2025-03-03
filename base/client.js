// base/client.js
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("../asset/config.js");
const logger = require("../util/logger.js");

// Create a new Discord client instance.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Channel],
});

// Initialize collections using our handler function.
const { initCollections } = require("../handler/collection.js");
initCollections(client);

// Initialize client variables using our handler function.
const { initVariables } = require("../handler/variable.js");
initVariables(client);

// Load prefix commands.
const { loadCommands } = require("../handler/command.js");
loadCommands(client);

// Load slash commands.
const { loadSlashCommands } = require("../handler/slash.js");
loadSlashCommands(client);

// Load standard client events (skipping anticrash & shard events).
const { loadEvents } = require("../handler/event.js");
loadEvents(client);

// Register slash commands with the Discord API.
const { registerSlashCommands } = require("../handler/register.js");
registerSlashCommands(client);

// Load process-level error handlers.
require("../event/client/anticrash.js")(logger);

// Load shard error handler.
require("../event/shard/shardError.js")(client, logger);

// Connect to MongoDB using our dedicated database handler.
const connectMongo = require("../event/database/mongo.js");
connectMongo(config.mongoURI, logger);

// Log in to Discord.
client
  .login(config.token)
  .then(() => logger.info(`${client.user.tag} has logged in.`))
  .catch((err) => logger.error("Failed to login: " + err));

module.exports = client;
