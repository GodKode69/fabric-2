const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  eco: {
    bal: { type: Number, default: 0 },
  },
  lastRewardLevel: {
    // New field to track the highest level reward given
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("xp", Schema);
