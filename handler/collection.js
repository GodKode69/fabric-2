const { Collection } = require("discord.js");

function initCollections(client) {
  client.commands = new Collection();
  client.slashCommands = new Collection();
  client.events = new Collection();
  client.queue = new Map();
}

module.exports = { initCollections };
