// cmd/music/pause.js
module.exports = {
  name: "pause",
  description: "Pause the current track.",
  usage: "pause",
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
      await player.pause(true);
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Paused",
            description: "Playback has been paused.",
          }),
        ],
      });
    } catch (error) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: `There was an error pausing playback. ${error}`,
          }),
        ],
      });
    }
  },
};
