const { REST, Routes } = require("discord.js");
const config = require("../asset/config.js");
const logger = require("../util/logger.js");

async function registerSlashCommands(client) {
  const slashCommandsData = [];
  client.slashCommands.forEach((cmd) => {
    if (cmd.data) {
      slashCommandsData.push(cmd.data.toJSON());
    }
  });

  const rest = new REST({ version: "10" }).setToken(config.token);

  try {
    logger.info(
      `Started refreshing ${slashCommandsData.length} slash (/) command(s).`
    );
    await rest.put(Routes.applicationCommands(config.clientId), {
      body: slashCommandsData,
    });
    logger.info(
      `Successfully reloaded ${slashCommandsData.length} slash (/) command(s).`
    );
  } catch (error) {
    logger.error("Error registering slash commands: " + error);
  }
}

module.exports = { registerSlashCommands };
