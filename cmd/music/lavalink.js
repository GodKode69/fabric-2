// cmd/music/lavalink.js
const { EmbedBuilder } = require("discord.js");

// Inline helper function to format time in milliseconds to a human-readable string.
function formatTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds %= 60;
  minutes %= 60;
  return (
    (hours ? hours + "h " : "") +
    (minutes ? minutes + "m " : "") +
    seconds +
    "s"
  );
}

// Inline helper function to format bytes to a human-readable string.
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

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

    // Iterate over each Lavalink node.
    client.kazagumo.shoukaku.nodes.forEach((node) => {
      try {
        const status = node.stats ? "🟢" : "🔴";
        const statsInfo = node.stats
          ? `**Players:** ${node.stats.players}\n` +
            `**Playing:** ${node.stats.playingPlayers}\n` +
            `**Uptime:** ${
              node.stats.uptime ? formatTime(node.stats.uptime) : "N/A"
            }\n` +
            `**Cores:** ${
              node.stats.cpu && node.stats.cpu.cores
                ? node.stats.cpu.cores + " Core(s)"
                : "N/A"
            }\n` +
            `**Memory:** ${
              node.stats.memory
                ? formatBytes(node.stats.memory.used) +
                  "/" +
                  formatBytes(node.stats.memory.reservable)
                : "N/A"
            }\n` +
            `**System Load:** ${
              node.stats.cpu && node.stats.cpu.systemLoad
                ? (Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(
                    2
                  ) + "%"
                : "N/A"
            }\n` +
            `**Lavalink Load:** ${
              node.stats.cpu && node.stats.cpu.lavalinkLoad
                ? (Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(
                    2
                  ) + "%"
                : "N/A"
            }`
          : "Stats not available";

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
