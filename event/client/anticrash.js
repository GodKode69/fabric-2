// event/client/anticrash.js
module.exports = (logger) => {
  process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    console.error(error);
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise} - reason: ${reason}`);
    console.error(reason);
  });
};
