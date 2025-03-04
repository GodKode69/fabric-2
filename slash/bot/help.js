const { SlashCommandBuilder } = require("discord.js");
const config = require("../../asset/config.js");

module.exports = {
  category: "info",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Retrieves the bot's help menu.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("Get detailed help for a command")
        .setRequired(false)
    ),
  run: async (client, interaction) => {
    const cmdName = interaction.options.getString("command");

    // If a specific command is requested, show its detailed help (ephemeral is acceptable here).
    if (cmdName) {
      let cmd =
        client.slashCommands.get(cmdName.toLowerCase()) ||
        client.slashCommands.find(
          (c) => c.aliases && c.aliases.includes(cmdName.toLowerCase())
        );
      if (!cmd)
        return interaction.reply({
          content: "Command not found.",
          ephemeral: true,
        });

      const detailEmbed = client.buildEmbed(client, {
        title: `Help: ${cmd.data.name}`,
        description: cmd.description || "No description provided.",
        fields: [
          { name: "Usage", value: `\`${config.prefix}${cmd.data.name}\`` },
          {
            name: "Aliases",
            value: cmd.aliases ? cmd.aliases.join(" | ") : "None",
          },
        ],
      });
      return interaction.reply({ embeds: [detailEmbed], ephemeral: true });
    }

    // Otherwise, build the paginated help menu.
    const pages = [];

    // Page 1: Blank/template page.
    const page1 = client.buildEmbed(client, {
      title: "Fabric | Help Menu",
      description:
        "Prefix `" +
        config.prefix +
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
            "\n[Developer](https://discord.com/users/" +
            client.emj.owner +
            ")",
          inline: true,
        },
      ],
      footer: { text: "Page 1/2" },
    });
    pages.push(page1);

    // Page 2: Dynamic command list grouped by category.
    const commands = client.slashCommands;
    const categories = {};
    commands.forEach((cmd) => {
      const cat = cmd.category ? cmd.category.toLowerCase() : "uncategorized";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.data.name);
    });
    const fields = [];
    for (const cat in categories) {
      const catTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
      fields.push({ name: catTitle, value: categories[cat].join(", ") });
    }
    const page2 = client.buildEmbed(client, {
      title: "All Slash Commands",
      description: "",
      fields: fields,
      footer: { text: `Page 2/2 | Use /help <cmd> for details` },
    });
    pages.push(page2);

    // IMPORTANT: Send the paginated menu as a public message so the components remain interactive.
    await interaction.reply({ embeds: [pages[0]] });
    const helpMessage = await interaction.fetchReply();
    client.pager.paginate({
      message: helpMessage,
      userId: interaction.user.id,
      pages,
      time: 60000,
    });
  },
};
