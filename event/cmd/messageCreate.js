// event/cmd/messageCreate.js

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    // Ignore messages from bots or those that do not start with the prefix.
    if (message.author.bot) return;
    const config = require("../../asset/config.js");
    const prefix = config.prefix || "-";
    if (!message.content.startsWith(prefix)) return;

    // Parse command name and arguments.
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Retrieve command by name or alias.
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return; // No matching command found.

    try {
      // Run the command (any additional checks can be added here).
      await command.run(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command.");
    }
  },
};
