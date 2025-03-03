const fs = require("fs");
const path = require("path");
const logger = require("../util/logger.js");

function loadCommands(client) {
  const commandsDir = path.join(__dirname, "../cmd");
  const load = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      if (stat.isDirectory()) {
        load(filepath);
      } else if (file.endsWith(".js")) {
        const command = require(filepath);
        if (command.name) {
          client.commands.set(command.name, command);
        }
      }
    }
  };
  load(commandsDir);
  logger.info(`Loaded ${client.commands.size} prefix command(s).`);
}

module.exports = { loadCommands };
