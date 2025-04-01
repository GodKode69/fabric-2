// event/music/close.js
module.exports = {
  name: "close",
  execute: (nodeName, code, reason, client) => {
    console.warn(
      `Lavalink ${nodeName}: Closed, Code ${code}, Reason ${
        reason || "No reason"
      }`
    );
  },
};
