// cmd/music/lavalink.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "lavalink",
  description: "Displays Lavalink node statistics.",
  usage: "lavalink",
  category: "music",
  execute: async (client, message, args) => {
    const embed = new EmbedBuilder()
      .setTitle("Lavalink Node Statistics")
      .setColor(client.variables.color)
      .setTimestamp();

    // Loop through each Lavalink node.
    client.kazagumo.shoukaku.nodes.forEach((node) => {
      try {
        // Status emoji: green if stats exist, red if not.
        const status = node.stats ? "🟢" : "🔴";
        // Build a multi-line string with node stats.
        const statsInfo = node.stats
          ? `**Player:** ${node.stats.players}\n` +
            `**Playing:** ${node.stats.playingPlayers}\n` +
            `**Uptime:** ${client.utils.formatTime(node.stats.uptime)}\n` +
            `**Cores:** ${node.stats.cpu.cores} Core(s)\n` +
            `**Memory:** ${client.utils.formatBytes(
              node.stats.memory.used
            )}/${client.utils.formatBytes(node.stats.memory.reservable)}\n` +
            `**System Load:** ${(
              Math.round(node.stats.cpu.systemLoad * 100) / 100
            ).toFixed(2)}%\n` +
            `**Lavalink Load:** ${(
              Math.round(node.stats.cpu.lavalinkLoad * 100) / 100
            ).toFixed(2)}%`
          : "Stats not available";

        // Add one field per node.
        embed.addFields({
          name: `${node.name} ${status}`,
          value: statsInfo,
          inline: true,
        });
      } catch (e) {
        console.error(e);
      }
    });

    return message.channel.send({ embeds: [embed] });
  },
};
