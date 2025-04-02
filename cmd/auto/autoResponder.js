const db = require("../../data/guild/guild");

module.exports = {
  name: "autoresponder",
  aliases: ["autorespond"],
  description: "Automatically respond to the configures trigger.",
  usage: "trigger add <trigger> / autoresponder trigger remove <",
  category: "auto",
  args: true,
  execute: async (client, message, args) => {
    const data = await db.findOne({ guildId: message.guild.id });
    if (args[0].toLowerCase() == "trigger") {
      const disable = ["@everyone", "@here"];
      if (args[1].toLowerCase(0) == "add") {
        if (args.contains(disable)) {
          return message.channel.send({
            embeds: [
              client.buildEmbed(client, {
                description: `Use of \`@everyone\` or \`@here\` is disabled for autoresponder.`,
              }),
            ],
          });
        }
        data.autoResponder.text = args.join(" ", 2);
        await data.save();
      } else if (args[1].toLowerCase() == "remove") {
      } else return;
    } else if (args[0].toLowerCase() == "embed") {
      if (args[1].toLowerCase() == "true") {
        data.autoResponder.embed = true;
        await data.save();
      } else if (args[1].toLowerCase() == "false") {
        data.autoResponder.embed = false;
        await data.save();
      }
    } else return;
  },
};
