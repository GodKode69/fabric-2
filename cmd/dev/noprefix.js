module.exports = {
  name: "noprefix",
  aliases: [""],
  description: "Add an user to the no-prefix database.",
  usage: "add <user> <time>, remove <user>",
  category: "dev",
  args: true,
  owner: true,
  execute: async (client, message, args) => {
    const db = require("../../data/user/user");
    const user = await db.findOne({ userId: message.author.id });

    if (args[0].toLowerCase() === "add") {
      if (!user.noPrefix.active) {
        {
          user.noPrefix.active = true;
          user.noPrefix.enabled = true;
          await user.save();
          message.channel.send({
            embeds: [
              client.buildEmbed(client, {
                description: `${client.emoji.util.ok} Added <@${message.author.id}> to my no-prefix database.`,
              }),
            ],
          });
        }
      } else {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `${client.emoji.util.cross} This user is already in my no-prefix database.`,
            }),
          ],
        });
      }
    } else if (args[0].toLowerCase() === "remove")
      if (user.noPrefix.active) {
        
          user.noPrefix.active = false;
          user.noPrefix.enabled = false;

          return message.channel.send({embeds: [client.buildEmbed(client, {
            description:  `${client.emoji.util.ok} Removed <@${message.author.id}> to my no-prefix database.`,
          })]})
        
      } else {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `${client.emoji.util.cross} This user is not in my no-prefix database.`,
            }),
          ],
        });
      }
  },
};
