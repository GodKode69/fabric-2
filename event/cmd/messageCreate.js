// event/cmd/messageCreate.js
const db = require("../../data/guild/guild.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    let guildData = await db.findOne({ guildId: message.guild.id });
    if (!guildData) {
      guildData = await db.create({ guildId: message.guild.id });
    }

    let pfx = guildData.prefix ? guildData.prefix : client.variables.prefix;

    const mentionRegex = new RegExp(`^<@!?${client.user.id}>\\s*`);

    if (!message.content.startsWith(pfx) && !mentionRegex.test(message.content))
      return;

    let content = message.content;
    if (mentionRegex.test(content)) {
      content = content.replace(mentionRegex, "");
    } else {
      content = content.slice(pfx.length);
    }

    const args = content.trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    if (command.args && !args[0]) {
      return message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            description: `The command is missing arguments, please reffer to the help command.`,
          }),
        ],
      });
    }

    if (command.owner == true) {
      if (!client.variables.owners.includes(message.author.guild)) {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `You do not possess the authority to execute this command.`,
            }),
          ],
        });
      }
    }

    try {
      await command.execute(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command.");
    }
  },
};
