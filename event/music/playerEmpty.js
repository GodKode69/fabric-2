// event/music/playerEmpty.js
module.exports = {
  name: "playerEmpty",
  execute: async (player, client) => {
    // Fetch the guild and voice channel.
    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;
    const voiceChannel = guild.channels.cache.get(player.voiceId);
    if (!voiceChannel) return;

    // Check if voice channel is empty (only bot is present).
    if (voiceChannel.members.size > 1) return;

    // Wait 15 seconds.
    setTimeout(async () => {
      // Fetch updated voice channel state.
      const updatedChannel = guild.channels.cache.get(player.voiceId);
      // If still only the bot (or empty) and nothing is playing, destroy the player.
      if (
        updatedChannel &&
        updatedChannel.members.size <= 1 &&
        !player.playing
      ) {
        const textChannel = guild.channels.cache.get(player.textId);
        if (textChannel) {
          await textChannel.send({
            embeds: [
              client.buildEmbed(client, {
                title: "Player Left",
                description:
                  "No one was in the voice channel. Leaving after 15 seconds of inactivity.",
              }),
            ],
          });
        }
        player.destroy();
      }
    }, 15000);
  },
};
