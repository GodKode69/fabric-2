const fs = require("fs");
const path = require("path");
const logger = require("../util/logger.js");

function loadEvents(client) {
  const eventsDir = path.join(__dirname, "../event");
  const load = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      // Skip the "shard" folder entirely and any anticrash file.
      if (stat.isDirectory()) {
        if (path.basename(filepath) === "shard") continue;
        load(filepath);
      } else if (file.endsWith(".js")) {
        if (filepath.includes("anticrash")) continue;
        const event = require(filepath);
        if (event.name) {
          client.events.set(event.name, event);
          if (event.once) {
            client.once(event.name, (...args) =>
              event.execute(...args, client)
            );
          } else {
            client.on(event.name, (...args) => event.execute(...args, client));
          }
        }
      }
    }
  };
  load(eventsDir);
  logger.info(`Loaded ${client.events.size} event(s).`);
}

module.exports = { loadEvents };
