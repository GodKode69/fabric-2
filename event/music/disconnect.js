// event/music/disconnect.js
module.exports = {
  name: "disconnect",
  execute: (nodeName, count, client) => {
    const players = [...client.kazagumo.shoukaku.players.values()].filter(
      (p) => p.node.name === nodeName
    );
    players.forEach((player) => {
      client.kazagumo.destroyPlayer(player.guildId);
      player.destroy();
    });
    console.warn(`Lavalink ${nodeName}: Disconnected`);
  },
};
