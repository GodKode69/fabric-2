// event/database/mongo.js
const mongoose = require("mongoose");

module.exports = async function connectMongo(mongoURI, logger) {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB successfully.");
  } catch (err) {
    logger.error("MongoDB connection error: " + err);
  }
};
