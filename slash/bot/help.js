const { SlashCommandBuilder } = require("discord.js");
const config = require("../../asset/config.js");

module.exports = {
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

    // If a specific command is requested, show its detailed help.
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
      title: "Help Menu - Page 1",
      description: "This is a blank template page. Customize it as needed.",
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
      footer: { text: `Page 2/2 | Use /help <command> for details` },
    });
    pages.push(page2);

    // Send initial ephemeral reply, then fetch it and pass it to our pager.
    await interaction.reply({ embeds: [pages[0]], ephemeral: true });
    const helpMessage = await interaction.fetchReply();
    client.pager.paginate({
      message: helpMessage,
      userId: interaction.user.id,
      pages,
      time: 60000,
    });
  },
};
