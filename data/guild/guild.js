const mongo = require("mongoose");

const guild = new mongo.Schema({
  guildId: {
    type: String,
  },
  chatbot: {
    channelId: {
      type: String,
    },
    persona: {
      type: String,
    },
  },
  autoresponses: {
    trigger: {
      type: String,
    },
    response: {
      type: String,
    },
  },
  autoreaction: {
    trigger: {
      type: String,
    },
    reaction: {
      type: String,
    },
  },
  ignore: {
    channelId: {
      type: String,
    },
    ignore: {
      type: Boolean,
      default: true,
    },
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
});

module.exports = mongo.model("guild", guild);
