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
  time: {
    type: Number,
    required: true,
  },
  Scope: {
    type: String,
    enum: ["global", "local"],
    default: "local",
  },
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
