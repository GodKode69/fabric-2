// cmd/music/volume.js
module.exports = {
  name: "volume",
  description: "Set the global volume (0-1000).",
  usage: "volume <number>",
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

    const arg = parseInt(args.join(""));
    console.log(arg);

    const volume = parseInt(args[0], 10);
    if (isNaN(volume)) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Volume",
            description: `The current volume is **${volume}**`,
          }),
        ],
      });
    }
    if (volume < 0 || volume > 1000) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: "Please provide a valid volume between 0 and 1000.",
          }),
        ],
      });
    }
    try {
      await player.setVolume(volume);
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Volume Set",
            description: `Volume set to ${volume}.`,
          }),
        ],
      });
    } catch (error) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: "There was an error setting the volume.",
          }),
        ],
      });
    }
  },
};
