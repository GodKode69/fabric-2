// event/music/playerEnd.js
module.exports = {
  name: "playerEnd",
  execute: (player, track, client) => {
    const textChannel = client.channels.cache.get(player.textId);
    if (textChannel && player.data.has("nowPlaying")) {
      player.data.get("nowPlaying").delete().catch(console.error);
      player.data.delete("nowPlaying");
    }
  },
};
