const db = require("../../data/user/xp");

// Global cooldown map for XP (userId -> timestamp)
const cooldowns = new Map();

// Helper: cumulative XP threshold for a given level.
// For level N, total XP required is the sum for i=1 to N-1 of 100 * (1.5)^(i-1)
function getXpThreshold(level) {
  let threshold = 0;
  for (let i = 1; i < level; i++) {
    threshold += 100 * Math.pow(1.5, i - 1);
  }
  return threshold;
}

// Helper: calculate level-up reward for a given level.
// For level 2, reward is 1000; for level 3, reward is 1000 * 1.5; for level 4, reward is 1000 * 1.5^2, etc.
function getLevelReward(level) {
  if (level < 2) return 0;
  return Math.floor(1000 * Math.pow(1.5, level - 2));
}

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    try {
      // Ignore bots, non-guild messages, and system messages.
      if (message.author.bot || !message.guild || message.system) return;

      // Enforce a random cooldown between 2–10 seconds per user.
      if (cooldowns.has(message.author.id)) return;
      const cooldownTime =
        Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
      cooldowns.set(message.author.id, Date.now());
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, cooldownTime);

      // Fetch or create the XP document for this user.
      let userXp = await db.findOne({ userId: message.author.id });
      if (!userXp) {
        userXp = new db({ userId: message.author.id });
      }

      // Ensure eco object and lastRewardLevel exist.
      if (!userXp.eco) userXp.eco = { bal: 0 };
      if (!userXp.lastRewardLevel) userXp.lastRewardLevel = userXp.level;

      // Retrieve guild-specific prefix.
      const dbg = require("../../data/guild/guild");
      let guildData = await dbg.findOne({ guildId: message.guild.id });
      let pfx =
        guildData &&
        guildData.prefix &&
        guildData.prefix !== client.variables.prefix
          ? guildData.prefix
          : client.variables.prefix;
      const mentionRegex = new RegExp(`^<@!?${client.user.id}>\\s*`);

      // Check if the message is a command.
      let command;
      if (
        message.content.startsWith(pfx) ||
        mentionRegex.test(message.content)
      ) {
        const argsArr = message.content.slice(pfx.length).trim().split(/ +/);
        const commandName = argsArr.shift().toLowerCase();
        command =
          client.commands.get(commandName) ||
          client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
          );
      }

      const customEmojiRegex = /<a?:\w+:\d+>/g;
      const emojiRegex =
        /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

      // Award XP:
      if (command) {
        userXp.xp += 15;
      } else if (message.attachments.size > 0) {
        userXp.xp += 10;
      } else if (customEmojiRegex.test(message.content)) {
        userXp.xp += 5;
      } else if (emojiRegex.test(message.content)) {
        userXp.xp += 2;
      } else {
        userXp.xp += 1;
      }

      // Calculate the new level based on XP.
      let newLevel = userXp.level;
      while (userXp.xp >= getXpThreshold(newLevel + 1)) {
        newLevel++;
      }

      // If the new level is greater than the last level rewarded,
      // award rewards for all levels from lastRewardLevel+1 up to newLevel.
      if (newLevel > userXp.lastRewardLevel) {
        let rewardMessages = [];
        for (let lvl = userXp.lastRewardLevel + 1; lvl <= newLevel; lvl++) {
          const reward = getLevelReward(lvl);
          userXp.eco.bal += reward;
          if (lvl === userXp.lastRewardLevel + 1) {
            // Immediate next level.
            rewardMessages.push(
              `Congratulations <@${userXp.userId}>, you reached level ${lvl}.\nAnd here is your reward for reaching level ${lvl}: ${reward} Threads.`
            );
          } else {
            // Missed reward(s) for earlier levels.
            rewardMessages.push(
              `Oh, it seems you missed the earlier level up rewards. Here is your reward for level ${lvl}: ${reward} Threads.`
            );
          }
        }
        // Send the combined reward messages.
        message.channel.send(rewardMessages.join("\n"));
        // Update the user's level and lastRewardLevel.
        userXp.level = newLevel;
        userXp.lastRewardLevel = newLevel;
      }

      await userXp.save();
    } catch (error) {
      console.error("XP System Error:", error);
    }
  },
};
