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
    GatewayIntentBits.GuildVoiceStates,
    //GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Channel],
});

// Initialize Music Manager.
const { initMusicManager } = require("../handler/music.js");
// Initialize collections using our handler function.
const { initCollections } = require("../handler/collection.js");
const { initVariables } = require("../handler/variable.js");
const { loadCommands } = require("../handler/command.js");
const { loadEvents } = require("../handler/event.js");
const { registerSlashCommands } = require("../handler/register.js");
require("../event/client/anticrash.js")(logger);
require("../event/shard/shardError.js")(client, logger);
const connectMongo = require("../event/database/mongo.js");
const { initBuilders } = require("../handler/builder.js");

initCollections(client);
initVariables(client);
initBuilders(client);

client.config = config;
// Log in to Discord.
async function login(token) {
  try {
    console.clear();
    try {
      initMusicManager(client);
      loadCommands(client);
      loadEvents(client);
      //registerSlashCommands(client);
      connectMongo(config.mongoURI, logger);
    } catch (err) {
      logger.error("Failed to load: " + err);
    }
    await client
      .login(token)
      .then(() => logger.mod(`${client.user.tag} has logged in.`))
      .catch((err) => logger.error("Failed to login: " + err));
  } catch (err) {
    logger.error("Failed to login: " + err);
  }
}
login(config.token);
module.exports = client;
