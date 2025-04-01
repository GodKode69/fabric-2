const { EmbedBuilder } = require("discord.js");
const db = require("../../data/guild/guild");
const logger = require("../../util/logger.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (!message.author.bot) return;

    try {
      // Fetch guild data
      const guildData = await db.findOne({ guildId: message.guild.id });
      if (!guildData || !guildData.autoDelete.enabled) return;

      // Check if the message is in the configured auto-delete channel
      if (message.channel.id !== guildData.autoDelete.id) return;

      // Prevent bot from deleting its own messages
      if (message.author.id === client.user.id) return;

      // Delete the bot message
      await message.delete();

      // Create an embed notification
      const embed = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setTitle("Fabric's Auto Message Deleter")
        .setDescription(`Deleted message from <@${message.author.id}>`);

      await message.channel.send
    } catch (error) {
      console.error("Error in messageCreate event (auto-delete):", error);
    }
  },
};
