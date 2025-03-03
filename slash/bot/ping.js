const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const buildEmbed = require("../../util/embed.js");
const { buildButton } = require("../../util/button.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      "Retrieve the bot's latency including database and Discord API latency."
    ),
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const wsPing = client.ws.ping;

      // Create custom button
      const button = buildButton({
        label: "Additional Info",
        style: ButtonStyle.Secondary,
        customId: "add",
      });
      const row = new ActionRowBuilder().addComponents(button);

      await interaction.editReply({
        content: `Pong 🏓 | ${wsPing}ms`,
        components: [row],
      });

      // Measure database ping
      const dbPingStart = Date.now();
      let dbPing = "N/A";
      try {
        await mongoose.connection.db.admin().ping();
        dbPing = Date.now() - dbPingStart;
      } catch (error) {
        console.error("Database ping error:", error);
      }

      // Measure API ping (simulate a delay)
      const apiPingStart = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 30));
      const apiPing = Date.now() - apiPingStart;

      // Determine footer image and text based on wsPing
      const gp =
        "https://cdn.discordapp.com/attachments/1247439613769945172/1279684945337385072/gp.png";
      const mp =
        "https://cdn.discordapp.com/attachments/1247439613769945172/1279684967919652915/1242650381192790046.png";
      const bp =
        "https://cdn.discordapp.com/attachments/1247439613769945172/1279684990346592308/1242650351237333127.png";

      let ftImg, ftText;
      if (wsPing > 500) {
        ftImg = bp;
        ftText = "Experiencing High Ping!";
      } else if (wsPing > 250) {
        ftImg = mp;
        ftText = "Experiencing Mediocre Ping.";
      } else {
        ftImg = gp;
        ftText = "Experiencing Good Ping.";
      }

      // Build embed using our custom embed builder
      const embed = buildEmbed(client, {
        title: "Latency Details",
        description: "Here are the detailed latency metrics:",
        fields: [
          {
            name: "Client",
            value: `\`\`\`yaml\n[ ${Math.round(wsPing)}ms ]\n\`\`\``,
            inline: true,
          },
          {
            name: "Database",
            value: `\`\`\`yaml\n[ ${dbPing}ms ]\n\`\`\``,
            inline: true,
          },
          {
            name: "Discord API",
            value: `\`\`\`yaml\n[ ${apiPing}ms ]\n\`\`\``,
            inline: true,
          },
        ],
        footer: { text: ftText, iconURL: ftImg },
      });

      // Create a collector for the button interaction
      const filter = (i) =>
        i.customId === "add" && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 100000,
        idle: 50000,
      });
      collector.on("collect", async (i) => {
        if (i.customId === "add") {
          await i.update({ content: "", embeds: [embed], components: [] });
        }
      });
    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(
          "There was an error executing the command."
        );
      } else {
        await interaction.reply("There was an error executing the command.");
      }
    }
  },
};
