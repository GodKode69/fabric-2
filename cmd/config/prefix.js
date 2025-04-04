module.exports = {
  name: "prefix",
  aliases: ["pfx"],
  description: "Change the bot's guild prefix.",
  usage: "<new prefix>, reset",
  category: "config",
  args: true,
  owner: false,
  execute: async (client, message, args) => {
    const db = require("../../data/guild/guild");
    const guild = await db.findOne({ guildId: message.guild.id });

    if (args[0].toLowerCase() === "reset") {
      guild.prefix = "-";
      await guild.save();
      return message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            description: `${client.emoji.util.ok} Successfully reset the prefix to ${guild.prefix}`,
          }),
        ],
      });
    } else if (args[0].length > 5) {
      return message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            description: `${client.emoji.util.cross} Prefix can not be of more than 5 characters.`,
          }),
        ],
      });
    } else {
      guild.prefix = args[0].trim();
      await guild.save();
      message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            description: `${client.emoji.util.ok} Successfully set the prefix to ${guild.prefix}`,
          }),
        ],
      });
    }
  },
};
