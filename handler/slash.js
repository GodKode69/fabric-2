// handler/slash.js
const fs = require("fs");
const path = require("path");
const logger = require("../util/logger.js");

function loadSlashCommands(client) {
  const slashDir = path.join(__dirname, "../slash");
  const load = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      if (stat.isDirectory()) {
        load(filepath);
      } else if (file.endsWith(".js")) {
        const command = require(filepath);
        if (command.data && command.data.name) {
          client.slashCommands.set(command.data.name, command);
        } else {
          logger.warn(
            `Slash command at ${filepath} is missing a data property with a name.`
          );
        }
      }
    }
  };
  load(slashDir);
  logger.info(`Loaded ${client.slashCommands.size} slash command(s).`);
}

module.exports = { loadSlashCommands };
