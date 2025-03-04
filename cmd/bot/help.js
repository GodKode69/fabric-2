const config = require("../../asset/config.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Retrieves the bot's help menu.",
  usage: "help [command]",
  category: "info",
  run: async (client, message, args) => {
    // If a specific command is requested, show its detailed help.
    if (args[0]) {
      let cmd =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );
      if (!cmd) return message.reply("Command not found.");

      const detailEmbed = client.buildEmbed(client, {
        title: `Help: ${cmd.name}`,
        description: cmd.description || "No description provided.",
        fields: [
          {
            name: "Usage",
            value: `\`${config.prefix}${cmd.usage || cmd.name}\``,
          },
          {
            name: "Aliases",
            value: cmd.aliases ? cmd.aliases.join(" | ") : "None",
          },
        ],
      });
      return message.channel.send({ embeds: [detailEmbed] });
    }

    // Otherwise, build the paginated help menu.
    const pages = [];

    // Page 1: Blank/template page for custom content.
    const page1 = client.buildEmbed(client, {
      title: "Help Menu - Page 1",
      description: "This.",
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
      fields.push({ name: catTitle, value: categories[cat].join(", ") });
    }
    const page2 = client.buildEmbed(client, {
      title: "All Commands",
      description: "",
      fields: fields,
      footer: {
        text: `Page 2/2 | Use ${config.prefix}help <command> for details`,
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
