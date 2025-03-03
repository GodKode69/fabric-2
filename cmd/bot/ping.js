// cmd/ping.js
const buildEmbed = require("../../util/embed.js");

module.exports = {
  name: "ping",
  description: "Check bot latency and API response.",
  aliases: ["speed"],
  usage: "ping",
  run: async (client, message, args) => {
    try {
      const sent = await message.channel.send("Pinging...");
      const latency = sent.createdTimestamp - message.createdTimestamp;
      const apiLatency = Math.round(client.ws.ping);

      const embed = buildEmbed(client, {
        title: "🏓 Pong!",
        description: `Latency: **${latency}ms**\nAPI Latency: **${apiLatency}ms**`,
      });

      sent.edit({ content: null, embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply("There was an error executing the command.");
    }
  },
};
