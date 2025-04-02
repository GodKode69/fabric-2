const db = require("../../data/guild/guild");

module.exports = {
  name: "autoresponder",
  aliases: ["autorespond", "autores"],
  description: "Automatically respond to the configured trigger.",
  usage:
    "<add|remove> <trigger> <response>, list, embed <true|false>, reply <true|false>",
  category: "auto",
  args: true,
  execute: async (client, message, args) => {
    let data = await db.findOne({ guildId: message.guild.id });
    if (!Array.isArray(data.autoResponder.triggers)) {
      data.autoResponder.triggers = [];
    }

    const subCommand = args[0].toLowerCase();

    if (subCommand === "add") {
      if (args.length < 3) {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `Usage: \`autoresponder add <trigger> <response>\``,
            }),
          ],
        });
      }
      const trigger = args[1].replace(/^`+|`+$/g, "").trim();
      const response = args
        .slice(2)
        .join(" ")
        .replace(/^`+|`+$/g, "")
        .trim();

      // Check for disabled substrings
      const disabledTriggers = ["@everyone", "@here"];
      if (disabledTriggers.some((word) => trigger.includes(word))) {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `Use of \`@everyone\` or \`@here\` is disabled for autoresponder triggers.`,
            }),
          ],
        });
      }

      // Check if trigger already exists (case-insensitive)
      if (
        data.autoResponder.triggers.find(
          (t) => t.trigger.toLowerCase() === trigger.toLowerCase()
        )
      ) {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `Trigger already exists: \`${trigger}\`.`,
            }),
          ],
        });
      }

      data.autoResponder.triggers.push({ trigger, response });
      await data.save();
      return message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            description: `Trigger added: \`${trigger}\` with reply: \`${response}\``,
          }),
        ],
      });
    } else if (subCommand === "remove") {
      if (args.length < 2) {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `Usage: \`autoresponder remove <trigger>\``,
            }),
          ],
        });
      }
      const trigger = args[1].trim();
      const index = data.autoResponder.triggers.findIndex(
        (t) => t.trigger.toLowerCase() === trigger.toLowerCase()
      );
      if (index === -1) {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `Trigger not found: \`${trigger}\``,
            }),
          ],
        });
      }
      data.autoResponder.triggers.splice(index, 1);
      await data.save();
      return message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            description: `Trigger removed: \`${trigger}\``,
          }),
        ],
      });
    } else if (subCommand === "list") {
      const triggers = data.autoResponder.triggers;
      if (!triggers || triggers.length === 0) {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: "No triggers have been set.",
            }),
          ],
        });
      }

      // Paginate triggers (5 per page)
      const pages = [];
      for (let i = 0; i < triggers.length; i += 5) {
        const pageContent = triggers
          .slice(i, i + 5)
          .map(
            (entry, index) =>
              `**${i + index + 1}.** **${entry.trigger}** → ${entry.response}`
          )
          .join("\n");

        pages.push(
          client.buildEmbed(client, {
            title: "Autoresponder Triggers",
            description: pageContent,
          })
        );
      }

      const helpMessage = await message.channel.send({ embeds: [pages[0]] });
      client.pager.paginate({
        message: helpMessage,
        userId: message.author.id,
        pages,
        time: 60000,
      });
    } else if (subCommand === "reply") {
      if (args.length < 2) {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `Usage: \`autoresponder reply <true|false>\``,
            }),
          ],
        });
      }
      const replyStatus = args[1].toLowerCase();
      if (replyStatus === "true") {
        data.autoResponder.reply = true;
      } else if (replyStatus === "false") {
        data.autoResponder.reply = false;
      } else {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `Invalid option. Please use \`true\` or \`false\`.`,
            }),
          ],
        });
      }
      await data.save();
      return message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            description: `Autoresponder reply has been ${
              replyStatus === "true" ? "enabled" : "disabled"
            }.`,
          }),
        ],
      });
    } else if (subCommand === "embed") {
      if (args.length < 2) {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `Usage: \`autoresponder embed <true|false>\``,
            }),
          ],
        });
      }
      const embedStatus = args[1].toLowerCase();
      if (embedStatus === "true") {
        data.autoResponder.embed = true;
      } else if (embedStatus === "false") {
        data.autoResponder.embed = false;
      } else {
        return message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              description: `Invalid option. Please use \`true\` or \`false\`.`,
            }),
          ],
        });
      }
      await data.save();
      return message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            description: `Autoresponder embed has been ${
              embedStatus === "true" ? "enabled" : "disabled"
            }.`,
          }),
        ],
      });
    }
  },
};
