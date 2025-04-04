module.exports = {
  name: "bal",
  aliases: ["balance", "cash"],
  description: "Check how many threads you got.",
  usage: "[user]",
  category: "economy",
  args: false,
  owner: false,
  execute: async (client, message, args) => {
    const db = require("../../data/user/xp");
    let userId;
    if (message.mentions.users.first()) {
      userId = message.mentions.users.first().id;
    } else if (args[0] && /^[0-9]+$/.test(args[0])) {
      userId = args[0];
    } else {
      userId = message.author.id;
    }

    const xpDoc = (await db.findOne({ userId: userId })) 

    let displayUsername = message.author.username;
    const fetchedUser = client.users.cache.get(userId);
    if (fetchedUser) {
      displayUsername = fetchedUser.username;
    }

    const embed = client.buildEmbed(client, {
      title: `${displayUsername}'s Balance`,
      description: `${xpDoc.eco.bal} Threads`,
    });

    return message.channel.send({ embeds: [embed] });
  },
};
