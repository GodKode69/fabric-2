const db = require("../../data/guild/guild");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    try {
      if (message.author.bot || !message.guild) return;

      const data = await db.findOne({ guildId: message.guild.id });
      if (!data || !data.autoResponder) return;

      const { triggers, embed } = data.autoResponder;
      if (!Array.isArray(triggers) || triggers.length === 0) return;

      for (const t of triggers) {
        if (message.content.toLowerCase().includes(t.trigger.toLowerCase())) {
          if (embed) {
            const embedReply = client.buildEmbed(client, {
              description: `${t.response}`,
            });
            await message.channel.send({ embeds: [embedReply] });
          } else {
            await message.channel.send(`${t.response}`);
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
