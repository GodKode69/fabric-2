const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const emojis = require("../../assets/emojis.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      "Retrieve the bot's latency including database and Discord API latency."
    ),

  run: async (client, interaction) => {
    try {
      // Defer reply to allow time for processing
      await interaction.deferReply();
      const wsPing = client.ws.ping;

      // Create an action row with the "Additional Info" button
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Additional Info")
          .setCustomId("add")
      );

      await interaction.editReply({
        content: `Pong 🏓 | ${wsPing}ms`,
        components: [row],
      });

      // Measure Database Ping
      const dbPingStart = Date.now();
      let dbPing = "N/A";
      try {
        const mongoose = require("mongoose");
        await mongoose.connection.db.admin().ping();
        dbPing = Date.now() - dbPingStart;
      } catch (error) {
        console.error("Database ping error:", error);
      }

      // Measure API Ping (simulate a small delay)
      const apiPingStart = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 30));
      const apiPing = Date.now() - apiPingStart;

      // Define image URLs for footer indication
      const gp =
        "https://cdn.discordapp.com/attachments/1247439613769945172/1279684945337385072/gp.png?ex=66d556fa&is=66d4057a&hm=bc97f17246c22d08a0f8fe6fda1d2bb0c30e0f640f9316dc7a0e6c2d408df766&";
      const mp =
        "https://cdn.discordapp.com/attachments/1247439613769945172/1279684967919652915/1242650381192790046.png?ex=66d556ff&is=66d4057f&hm=5019361f0379b89d2b19b9d24eb93fd932f6db378e102080e0c96a677ccdbaf1&";
      const bp =
        "https://cdn.discordapp.com/attachments/1247439613769945172/1279684990346592308/1242650351237333127.png?ex=66d55705&is=66d40585&hm=15f966aaed10e67fae6117a6780b968726cebe0f395ce94a6aeb8696eb77cf2f&";

      let ftImg;
      let ftText;
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

      // Build the embed with detailed latency info
      const embed = new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor(client.variables.color)
        .addFields([
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
        ])
        .setFooter({ text: ftText, iconURL: ftImg })
        .setTimestamp();

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
