// cmd/music/skip.js
module.exports = {
  name: "skip",
  description: "Skip the current track.",
  usage: "skip",
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
      await player.skip();
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Skipped",
            description: "The current track has been skipped.",
          }),
        ],
      });
    } catch (error) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: "There was an error skipping the track.",
          }),
        ],
      });
    }
  },
};
