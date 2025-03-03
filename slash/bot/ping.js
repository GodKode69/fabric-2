// slash/ping.js
const { SlashCommandBuilder } = require("discord.js");
const buildEmbed = require("../../util/embed.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency and API response."),
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const reply = await interaction.fetchReply();
      const latency = reply.createdTimestamp - interaction.createdTimestamp;
      const apiLatency = Math.round(client.ws.ping);

      const embed = buildEmbed(client, {
        title: "🏓 Pong!",
        description: `Latency: **${latency}ms**\nAPI Latency: **${apiLatency}ms**`,
      });

      await interaction.editReply({ content: null, embeds: [embed] });
    } catch (err) {
      console.error(err);
      interaction.editReply("There was an error executing the command.");
    }
  },
};
