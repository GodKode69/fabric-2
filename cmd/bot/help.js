const {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const buildEmbed = require("../../util/embed.js");
const config = require("../../asset/config.js");
const emojis = require("../../asset/emojis.js"); // Assumed to be available

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Retrieves the bot's help menu.",
  usage: "help [command]",
  category: "info",
  run: async (client, message, args) => {
    // If a specific command is requested, show detailed info.
    if (args[0]) {
      let cmd =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );
      if (!cmd) return message.reply("Command not found.");

      const embed = buildEmbed(client, {
        title: `Help: ${cmd.name}`,
        description: cmd.description || "No description provided.",
        fields: [
          {
            name: "Usage",
            value: `\`${config.prefix}${cmd.usage || cmd.name}\``,
          },
          {
            name: "Aliases",
            value: cmd.aliases ? cmd.aliases.join(", ") : "None",
          },
        ],
      });
      return message.channel.send({ embeds: [embed] });
    }

    // No specific command: display category‐wise help.
    // Dynamically group commands by category.
    const commands = client.commands;
    const categories = {};
    commands.forEach((cmd) => {
      const cat = cmd.category ? cmd.category.toLowerCase() : "uncategorized";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.name);
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
        text: `Total Commands: ${client.commands.size} | Use ${config.prefix}help <command> for details`,
      },
    });

    // Create control buttons.
    const homeButton = new ButtonBuilder()
      .setCustomId("home")
      .setLabel("Home")
      .setStyle(ButtonStyle.Secondary);
    const deleteButton = new ButtonBuilder()
      .setCustomId("delete")
      .setLabel("Delete")
      .setStyle(ButtonStyle.Secondary);
    const buttonRow = new ActionRowBuilder().addComponents(
      homeButton,
      deleteButton
    );

    // Create a select menu with dynamic category options.
    const options = [];
    for (const cat in categories) {
      const catTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
      options.push({ label: catTitle, value: cat });
    }
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("categorySelect")
      .setPlaceholder("Select a command category")
      .addOptions(options);
    const selectRow = new ActionRowBuilder().addComponents(selectMenu);

    const helpMessage = await message.channel.send({
      embeds: [mainEmbed],
      components: [buttonRow, selectRow],
    });

    const collector = helpMessage.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 100000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.isButton()) {
        if (interaction.customId === "home") {
          return interaction.update({
            embeds: [mainEmbed],
            components: [buttonRow, selectRow],
          });
        }
        if (interaction.customId === "delete") {
          return helpMessage.delete().catch(() => {});
        }
      } else if (interaction.isStringSelectMenu()) {
        const selectedCategory = interaction.values[0];
        const cmds = categories[selectedCategory] || [];
        const catTitle =
          selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        const categoryEmbed = buildEmbed(client, {
          title: `${catTitle} Commands`,
          description: cmds.join(", "),
          footer: { text: `Use ${config.prefix}help <command> for details.` },
        });
        return interaction.update({
          embeds: [categoryEmbed],
          components: [buttonRow, selectRow],
        });
      }
    });

    collector.on("end", async () => {
      try {
        await helpMessage.edit({ components: [] });
      } catch (e) {}
    });
  },
};
