// cmd/music/stop.js
module.exports = {
  name: "stop",
  description: "Stop the currently playing track and clear the queue.",
  usage: "stop",
  category: "music",
  execute: async (client, msg, args) => {
    const player = client.kazagumo.players.get(msg.guild.id);
    if (!player) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: "No player is currently active in this guild.",
          }),
        ],
      });
    }
    try {
      await player.stopTrack();
      // Optionally clear the queue.
      if (player.queue) player.queue = [];
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Stopped",
            description: "Playback stopped and queue cleared.",
          }),
        ],
      });
    } catch (error) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: error,
            description: "There was an error stopping playback.",
          }),
        ],
      });
    }
  },
};
