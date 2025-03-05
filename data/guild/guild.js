const mongo = require("mongoose");

const guild = new mongo.Schema({
  guildId: {
    type: String,
  },
  prefix: {
    type: String,
  },
  noPrefix: {
    enabled: {
      type: Boolean,
      default: false,
    },
    user: {
      type: String,
    },
  },
  blacklist: {
    type: Boolean,
    default: false,
  },
  premium: {
    enabled: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      index: { expires: 0 },
    },
  },
});

module.exports = mongo.model("guild", guild);
