const { Kazagumo } = require("kazagumo");
const { Connectors } = require("shoukaku");
const logger = require("../util/logger.js");
const config = require("../asset/config.js");

function initMusicManager(client) {
  client.kazagumo = new Kazagumo(
    {
      defaultSearchEngine: "spotify",
      spotify: {
        clientId: config.spotify.clientId,
        clientSecret: config.spotify.clientSecret,
      },
      send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
      },
    },
    new Connectors.DiscordJS(client),
    config.lavalink 
  );

  logger.info(`Music Module Started At: ${config.lavalink[0].name}`);
}

module.exports = { initMusicManager };
