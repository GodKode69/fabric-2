const { ActionRowBuilder, ButtonStyle } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ping",
  aliases: ["pong", "speed"],
  description:
    "Retrieve the bot's latency including database and Discord API latency.",
  usage: "ping",
  category: "info",
  run: async (client, message, args) => {
    // Send an initial message.
    const msg = await message.channel.send("Pinging...");
    const wsPing = client.ws.ping;

    // Create the "Additional Info" button using client.buildButton.
    const button = client.buildButton({
      label: "Additional Info",
      style: ButtonStyle.Secondary,
      customId: "add",
    });
    const row = new ActionRowBuilder().addComponents(button);

    // Edit the initial message with the ping result.
    await msg.edit({ content: `Pong 🏓 | ${wsPing}ms`, components: [row] });

    // Measure Database Ping.
    const dbPingStart = Date.now();
    let dbPing = "N/A";
    try {
      await mongoose.connection.db.admin().ping();
      dbPing = Date.now() - dbPingStart;
    } catch (error) {
      console.error("Database ping error:", error);
    }

    // Measure API Ping (simulate a small delay).
    const apiPingStart = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 30));
    const apiPing = Date.now() - apiPingStart;

    // Define footer images and text based on WebSocket ping.
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

    // Build the detailed latency embed using client.buildEmbed.
    const embed = client.buildEmbed(client, {
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

    // Set up a message component collector to handle button interaction.
    const collector = msg.createMessageComponentCollector({
      filter: (interaction) => {
        if (message.author.id === interaction.user.id) return true;
        else {
          interaction.reply({
            content: `Only **${message.author.tag}** can interact.`,
            ephemeral: true,
          });
        }
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
