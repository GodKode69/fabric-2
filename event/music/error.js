// event/music/error.js
module.exports = {
  name: "error",
  execute: (nodeName, error, client) => {
    console.error(`Lavalink ${nodeName}: Error Caught,`, error);
  },
};
