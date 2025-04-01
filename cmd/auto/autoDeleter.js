const db = require("../../data/guild/guild");

module.exports = {
  name: "autodeleter",
  aliases: ["autodel"],
  description:
    "Automatically deletes any bot's message in the configured channel.",
  usage: "autodeleter [channelID]",
  category: "auto",
  execute: async (client, message, args) => {
    try {
      let guildData = await db.findOne({ guildId: message.guild.id });
      if (!guildData) {
        guildData = new db({
          guildId: message.guild.id,
          autoDelete: { enabled: false, id: "" },
        });
      }

      if (args[0]) {
        // Extract channel ID from mention or argument
        let channelID = args[0].replace(/<#!?(\d+)>/, "$1"); // Extracts ID from "<#123456789012345678>"

        // Fetch channel from cache
        const channel = client.channels.cache.get(channelID);
        if (!channel) {
          return message.channel.send({
            embeds: [
              client.buildEmbed(client, {
                title: "Auto Deleter",
                description: `Invalid channel. Make sure the channel exists and is accessible.`,
              }),
            ],
          });
        }

        // Update DB and enable auto-delete
        guildData.autoDelete.enabled = true;
        guildData.autoDelete.id = channelID;
        await guildData.save();

        message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              title: "Auto Deleter",
              description: `Auto delete channel has been updated to <#${channelID}>.`,
            }),
          ],
        });
      } else {
        // Disable auto-delete if no argument is provided
        guildData.autoDelete.enabled = false;
        guildData.autoDelete.id = "";
        await guildData.save();

        message.channel.send({
          embeds: [
            client.buildEmbed(client, {
              title: "Auto Deleter",
              description: "Auto delete has been disabled for this guild.",
            }),
          ],
        });
      }
    } catch (error) {
      console.error("Auto Deleter Error:", error);
      message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            title: "Auto Deleter",
            description: `An error occurred: \`${error.message}\``,
          }),
        ],
      });
    }
  },
};
