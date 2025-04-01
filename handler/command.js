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
        // Load as a prefix command if 'name' exists
        if (command.name) {
          client.commands.set(command.name, command);
        }
        // Additionally load as a slash command if it has the appropriate structure
        if (command.data && command.execute) {
          client.slashCommands.set(command.data.name, command);
        }
      }
    }
  };
  load(commandsDir);
  logger.info(
    `Loaded ${client.commands.size} prefix command(s) and ${client.slashCommands.size} slash command(s).`
  );
}

module.exports = { loadCommands };
