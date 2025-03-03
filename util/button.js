// util/button.js
const { ButtonBuilder, ButtonStyle } = require("discord.js");

function buildButton(options = {}) {
  const button = new ButtonBuilder();
  if (options.label) button.setLabel(options.label);
  if (options.style) button.setStyle(options.style);
  else button.setStyle(ButtonStyle.Primary);
  if (options.customId) button.setCustomId(options.customId);
  if (options.url) button.setURL(options.url);
  if (typeof options.disabled === "boolean")
    button.setDisabled(options.disabled);
  if (options.emoji) button.setEmoji(options.emoji);
  return button;
}

module.exports = { buildButton };
