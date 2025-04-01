// cmd/music/seek.js
module.exports = {
  name: "seek",
  description:
    "Seek to a specific time in the current track (in milliseconds).",
  usage: "seek <position in ms>",
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
    const position = parseInt(args[0], 10);
    if (isNaN(position)) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: "Please provide a valid number for the seek position.",
          }),
        ],
      });
    }
    try {
      await player.seek(position);
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Seeked",
            description: `Playback position set to ${position}ms.`,
          }),
        ],
      });
    } catch (error) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: "There was an error seeking the track.",
          }),
        ],
      });
    }
  },
};
