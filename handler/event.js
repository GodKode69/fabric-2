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

      if (stat.isDirectory()) {
        // Skip "shard" folder and anticrash files.
        if (path.basename(filepath) === "shard") continue;
        load(filepath);
      } else if (file.endsWith(".js")) {
        if (filepath.includes("anticrash")) continue;

        const event = require(filepath);
        if (event.name) {
          // If the event is in the music folder, ensure client.kazagumo exists.
          if (filepath.includes(path.join("event", "music"))) {
            if (!client.kazagumo) {
              logger.warn(
                `Skipping music event ${file} because client.kazagumo is not initialized.`
              );
              continue;
            }
            // For player events, attach to client.kazagumo; for node events, attach to client.kazagumo.shoukaku.
            if (
              ["playerStart", "playerEnd", "playerEmpty"].includes(event.name)
            ) {
              client.kazagumo.on(event.name, (...args) =>
                event.execute(...args, client)
              );
            } else {
              client.kazagumo.shoukaku.on(event.name, (...args) =>
                event.execute(...args, client)
              );
            }
          } else {
            // Regular events attach to the main client.
            client.events.set(event.name, event);
            if (event.once) {
              client.once(event.name, (...args) =>
                event.execute(...args, client)
              );
            } else {
              client.on(event.name, (...args) =>
                event.execute(...args, client)
              );
            }
          }
        }
      }
    }
  };

  load(eventsDir);
  logger.info(`Loaded ${client.events.size} event(s).`);
}

module.exports = { loadEvents };
