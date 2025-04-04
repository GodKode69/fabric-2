module.exports = {
  name: "xp",
  aliases: ["level", "rank"],
  description: "See how much XP you have globally.",
  usage: "",
  category: "xp",
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

    const xpDoc = (await db.findOne({ userId: userId })) || {
      xp: 0,
      level: 1,
    };

    // XP required to reach the next level (50% more than previous)
    function getXpThreshold(level) {
      let threshold = 0;
      for (let i = 1; i < level; i++) {
        threshold += 100 * Math.pow(1.5, i - 1);
      }
      return threshold;
    }

    const currentLevelThreshold = getXpThreshold(xpDoc.level);
    const nextLevelThreshold = getXpThreshold(xpDoc.level + 1);
    const xpNeeded = nextLevelThreshold - currentLevelThreshold;
    const currentProgress = xpDoc.xp - currentLevelThreshold;
    const percentage = (currentProgress / xpNeeded) * 100;
    const progressPercentage = percentage.toFixed(2);

    // Build progress bar (✅ for filled, ⬜ for empty)
    let filledUnits = Math.floor(percentage / 10);
    if (filledUnits > 10) filledUnits = 10; // Cap at 10 units.
    const progressBar =
      "✅".repeat(filledUnits) + "⬜".repeat(10 - filledUnits);

    let displayUsername = message.author.username;
    const fetchedUser = client.users.cache.get(userId);
    if (fetchedUser) {
      displayUsername = fetchedUser.username;
    }

    const embed = client.buildEmbed(client, {
      title: `${displayUsername}'s Level`,
      description: `**Level:** ${xpDoc.level}\n**Experience:** ${currentProgress}/${xpNeeded} XP\n**Progress (${progressPercentage}%):**\n${progressBar}\n**Total Experience:** ${xpDoc.xp}\n`,
    });

    return message.channel.send({ embeds: [embed] });
  },
};
