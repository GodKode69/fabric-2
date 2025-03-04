// event/database/mongo.js
const mongoose = require("mongoose");

module.exports = async function connectMongo(mongoURI, logger) {
  try {
    // Ensure the writeConcern is set correctly to "majority" (not "majorit")
    await mongoose.connect(mongoURI, {
      writeConcern: { w: "majority" },
    });
    logger.info("Connected to MongoDB successfully.");
  } catch (err) {
    logger.error("MongoDB connection error: " + err);
  }
};
