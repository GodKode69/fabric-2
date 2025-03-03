const mongo = require("mongoose");

const Schema = new mongo.Schema({
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  // Store time as a Number (timestamp)
  time: {
    type: Number,
    required: true,
  },
  Scope: {
    type: String,
    enum: ["global", "local"],
    default: "local",
  },
  // Stores the original nickname for later restoration
  originalNick: {
    type: String,
    default: null,
  },
  dmNotify: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongo.model("afk", Schema);
