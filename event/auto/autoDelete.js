const { EmbedBuilder } = require("discord.js");
const db = require("../../data/guild/guild");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    try {
      let guildData = await db.findOne({ guildId: message.guild.id });
      if (!guildData || !guildData.autoDelete || !guildData.autoDelete.enabled)
        return;
      if (message.channel.id !== guildData.autoDelete.id) return;
      if (!guildData || !guildData.autoDelete.enabled) return;
      if (message.author.id === client.user.id) return;
      if (!message.author.bot) return;

      await message.delete();

      let notificationMessage =
        guildData.autoDelete.text || "Default notification message.";
      if (notificationMessage.includes("CHANNEL")) {
        notificationMessage = notificationMessage.replace(
          "CHANNEL",
          `<#${message.channel.id}>`
        );
      }

      const embed = client.buildEmbed(client, {
        title: "Auto Deleter",
        description: notificationMessage,
      });

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error in messageCreate handler:", error);
    }
  },
};
