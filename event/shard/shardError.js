// event/shard/shardError.js
module.exports = (client, logger) => {
  client.on("shardError", (error) => {
    logger.error(`A websocket connection encountered a shard error: ${error}`);
  });
};
