module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Retrieves the bot's help menu.",
  usage: "help [command]",
  category: "info",
  execute: async (client, message, args) => {
    // If a specific command is requested, show its detailed help.
    if (args[0]) {
      let cmd =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );
      if (!cmd) return message.reply("Command not found.");

      let usageText;
      let p = client.variables.prefix;
      if (cmd.usage) {
        const usages = cmd.usage
          .split(",")
          .map((u) => `\`${p}${cmd.name} ${u.trim()}\``);
        usageText = usages.join("\n");
      } else {
        usageText = `\`${p}${cmd.name}\``;
      }

      const detailEmbed = client.buildEmbed(client, {
        title: `Help: ${cmd.name}`,
        description: cmd.description || "No description provided.",
        fields: [
          {
            name: "Usage",
            value: usageText,
          },
          {
            name: "Aliases",
            value: cmd.aliases ? cmd.aliases.join(" | ") : "None",
            inline: true
          },
          {
            name: "Args",
            value: cmd.args? "True" : "False",
            inline: true
          }
        ],
      });

      return message.channel.send({ embeds: [detailEmbed] });
    }

    const pages = [];

    const page1 = client.buildEmbed(client, {
      title: "Fabric | Help Menu",
      description:
        "Prefix `" +
        client.variables.prefix +
        "`\nParams `<required>`, `[optional]`" +
        "\nCommands **" +
        client.commands.size +
        "** | Slash **" +
        client.slashCommands.size +
        "**",
      fields: [
        {
          name: "- Modules",
          value: ">>> `info`\n`mod`\n`util`\n`fun`\n`misc`",
          inline: true,
        },
        {
          name: "- Links",
          value:
            ">>> [Invite](https://discord.com/oauth2/authorize?client_id=" +
            client.user.id +
            "&scope=bot&permissions=8)\n[Support](https://discord.gg/yourserver)" +
            "\n[Developer](https:///discord.com/users/" +
            client.variables.owner +
            ")",
          inline: true,
        },
      ],
      footer: { text: "Page 1/2" },
    });
    pages.push(page1);

    // Page 2: Dynamic command list grouped by category.
    const commands = client.commands;
    const categories = {};
    commands.forEach((cmd) => {
      const cat = cmd.category ? cmd.category.toLowerCase() : "uncategorized";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.name);
    });
    const fields = [];
    for (const cat in categories) {
      const catTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
      fields.push({
        name: catTitle,
        value: `>>> ${categories[cat].join(", ")}`,
        inline: true,
      });
    }
    const page2 = client.buildEmbed(client, {
      title: "All Commands",
      description: "",
      fields: fields,
      footer: {
        text: `Page 2/2 | Use ${client.variables.prefix}help <cmd> for details`,
      },
    });
    pages.push(page2);

    // Send the initial message then call our custom pager.
    const helpMessage = await message.channel.send({ embeds: [pages[0]] });
    client.pager.paginate({
      message: helpMessage,
      userId: message.author.id,
      pages,
      time: 60000,
    });
  },
};
