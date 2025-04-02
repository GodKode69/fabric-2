const db = require("../../data/guild/guild");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    try {
      if (message.author.bot || !message.guild) return;

      const data = await db.findOne({ guildId: message.guild.id });
      if (!data || !data.autoResponder) return;

      const { triggers, embed, reply } = data.autoResponder;
      if (!Array.isArray(triggers) || triggers.length === 0) return;

      for (const t of triggers) {
        if (message.content.toLowerCase().includes(t.trigger.toLowerCase())) {
          const response = embed
            ? {
                embeds: [
                  client.buildEmbed(client, { description: t.response }),
                ],
              }
            : { content: t.response };

          if (reply) {
            await message.reply(response);
          } else {
            await message.channel.send(response);
          }

          // Only respond to the first matching trigger
          break;
        }
      }
    } catch (error) {
      console.error("Error in autoresponder messageCreate event:", error);
    }
  },
};
