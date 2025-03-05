const mongoose = require("mongoose");

const premium = new mongoose.Schema({
  userId: {
    type: String,
  },
  expiresAt: {
    type: Date,
    index: { expires: 0 },
  },
  guild: {
    id: {
      type: String,
    },
    amount: {
      type: Number,
    },
  },
});
