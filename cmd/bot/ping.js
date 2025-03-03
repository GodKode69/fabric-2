// cmd/ping.js
const { ActionRowBuilder, ButtonStyle } = require("discord.js");
const buildEmbed = require("../../util/embed.js");
const { buildButton } = require("../../util/button.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ping",
  aliases: ["pong", "speed"],
  description:
    "Retrieve the bot's latency including database and Discord API latency.",
  usage: "ping",
  run: async (client, message, args) => {
    // Send initial response
    const msg = await message.channel.send("Pinging...");
    const wsPing = client.ws.ping;

    // Create a custom button using our button builder
    const button = buildButton({
      label: "Additional Info",
      style: ButtonStyle.Secondary,
      customId: "add",
    });
    const row = new ActionRowBuilder().addComponents(button);

    await msg.edit({ content: `Pong 🏓 | ${wsPing}ms`, components: [row] });

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

    // Build embed with our custom embed builder
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
    const collector = msg.createMessageComponentCollector({
      filter: (interaction) => {
        if (interaction.user.id === message.author.id) return true;
        interaction.reply({
          content: `Only **${message.author.tag}** can interact.`,
          ephemeral: true,
        });
      },
      time: 100000,
      idle: 50000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "add") {
        await interaction.update({
          content: "",
          embeds: [embed],
          components: [],
        });
      }
    });
  },
};
