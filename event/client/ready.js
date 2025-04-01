// event/client/ready.js
const config = require("../../asset/config.js");
const logger = require("../../util/logger.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {

    // Set activity
    const setActivity = () => {
      const usersCount = client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      );
      const botGuilds = client.guilds.cache.size;
      const activities = [
        `${config.prefix}help | ${config.prefix}invite`,
        `${client.commands.size} commands`,
        `${usersCount} users`,
        `${botGuilds} guilds`,
      ];
      const activity =
        activities[Math.floor(Math.random() * activities.length)];
      client.user.setPresence({
        activities: [{ name: activity, type: 3 }],
        status: "dnd",
      });
    };

    setActivity();
    setInterval(setActivity, 120000);
  },
};
