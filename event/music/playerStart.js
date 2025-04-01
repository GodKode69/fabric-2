// event/music/playerStart.js
module.exports = {
  name: "playerStart",
  execute: (player, track, client) => {
    const textChannel = client.channels.cache.get(player.textId);
    if (textChannel) {
      textChannel
        .send({
          embeds: [
            client.buildEmbed(client, {
              title: "Now Playing",
              description: `Now playing **${track.title}** by **${track.author}**`,
            }),
          ],
        })
        .then((msg) => player.data.set("nowPlaying", msg));
    }
  },
};
