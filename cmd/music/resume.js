// cmd/music/resume.js
module.exports = {
  name: "resume",
  description: "Resume the current track.",
  usage: "resume",
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
      await player.resume(true);
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Resumed",
            description: "Playback has been resumed.",
          }),
        ],
      });
    } catch (error) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: "There was an error resuming playback.",
          }),
        ],
      });
    }
  },
};
