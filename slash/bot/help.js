const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const buildEmbed = require("../../util/embed.js");
const config = require("../../asset/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays the help menu."),
  run: async (client, interaction) => {
    // Dynamically group slash commands by category.
    const commands = client.slashCommands;
    const categories = {};
    commands.forEach((cmd) => {
      const cat = cmd.category ? cmd.category.toLowerCase() : "uncategorized";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.data.name);
    });

    let desc = "";
    for (const cat in categories) {
      const catTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
      desc += `**${catTitle}**: ${categories[cat].join(", ")}\n`;
    }
    const mainEmbed = buildEmbed(client, {
      title: "Help Menu",
      description: desc || "No commands available.",
      footer: {
        text: `Total Commands: ${commands.size} | Use /help <command> for details`,
      },
    });

    // Create a select menu for category selection.
    const options = [];
    for (const cat in categories) {
      const catTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
      options.push({ label: catTitle, value: cat });
    }
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("helpCategory")
      .setPlaceholder("Select a command category")
      .addOptions(options);
    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      embeds: [mainEmbed],
      components: [row],
      ephemeral: true,
    });

    const filter = (i) =>
      i.customId === "helpCategory" && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 100000,
    });

    collector.on("collect", async (i) => {
      const selectedCategory = i.values[0];
      const cmds = categories[selectedCategory] || [];
      const catTitle =
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      const categoryEmbed = buildEmbed(client, {
        title: `${catTitle} Commands`,
        description: cmds.join(", "),
        footer: { text: `Use /help <command> for details.` },
      });
      await i.update({ embeds: [categoryEmbed], components: [row] });
    });

    collector.on("end", async () => {
      // Optionally remove components after timeout.
    });
  },
};
