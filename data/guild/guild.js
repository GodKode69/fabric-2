const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  prefix: { type: String, default: "-" },
  noPrefix: {
    enabled: { type: Boolean, default: false },
    user: { type: String },
  },
  blacklist: { type: Boolean, default: false },
  premium: {
    enabled: { type: Boolean, default: false },
    expiresAt: { type: Date, index: { expires: 0 } },
  },
  autoDelete: {
    enabled: { type: Boolean, default: false },
    id: { type: String },
    whitelist: { type: [String] },
    text: {
      type: String,
      default: "Bot messages are disabled for CHANNEL.",
    },
  },
  autoResponder: {
    triggers: {
      type: [
        {
          trigger: { type: String, required: true },
          response: { type: String, required: true },
        },
      ],
      default: [],
    },
    embed: { type: Boolean, default: false },
    reply: { type: Boolean, ddefault: false },
  },
});

module.exports = mongoose.model("guild", guildSchema);
