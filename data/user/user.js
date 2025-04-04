const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  blacklist: {
    type: Boolean,
    default: false,
  },
  noPrefix: {
    active: { type: Boolean, default: false },
    enabled: { type: Boolean, default: false },
    expiresAt: { type: Date, index: { expires: 0 } },
  },
});

module.exports = mongoose.model("user", Schema);
