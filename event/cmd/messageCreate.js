// event/cmd/messageCreate.js

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    // Ignore messages from bots or those that do not start with the prefix.
    if (message.author.bot) return;
    const config = require("../../asset/config.js");
    const prefix = config.prefix || "-";
    const mentionRegex = new RegExp(`^<@!?${client.user.id}>\\s*`);

    if (
      !message.content.startsWith(prefix) &&
      !mentionRegex.test(message.content)
    )
      return;

    let content = message.content;
    if (mentionRegex.test(content)) {
      content = content.replace(mentionRegex, "");
    } else {
      content = content.slice(prefix.length);
    }

    const args = content.trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    try {
      await command.execute(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command.");
    }
  },
};
