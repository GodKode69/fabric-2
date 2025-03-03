// event/database/mongo.js
const mongoose = require("mongoose");

module.exports = async function connectMongo(mongoURI, logger) {
  try {
    await mongoose.connect(mongoURI); // Removed deprecated options
    logger.info("Connected to MongoDB successfully.");
  } catch (err) {
    logger.error("MongoDB connection error: " + err);
  }
};
