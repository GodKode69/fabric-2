const emojiData = require("./emoji.js");
const logger = require("../util/logger.js");

function initEmojis(client) {
  // Directly assign the emoji data to client.emoji
  client.emoji = {};

  let emc = 0;
  for (const category in emojiData) {
    if (Object.prototype.hasOwnProperty.call(emojiData, category)) {
      client.emoji[category] = {};
      for (const [key, value] of Object.entries(emojiData[category])) {
        client.emoji[category][key] = value;
        emc++;
      }
    }
  }

  logger.mod("Emojis Loaded: " + emc);
}

module.exports = { initEmojis };
