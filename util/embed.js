// util/embed.js
const { EmbedBuilder } = require("discord.js");

module.exports = (client, options = {}) => {
  const embed = new EmbedBuilder()
    .setColor(client.variables.color || "#FFFFFF")
    .setFooter({ text: client.variables.footer || "Error Fetching Footer" })
    .setTimestamp();

  if (options.title) embed.setTitle(options.title);
  if (options.description) embed.setDescription(options.description);
  if (options.fields) embed.addFields(options.fields);
  if (options.image) embed.setImage(options.image);
  if (options.thumbnail) embed.setThumbnail(options.thumbnail);

  return embed;
};
