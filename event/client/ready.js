const logger = require("../../util/logger.js");
const config = require("../../asset/config.js");

module.exports = async (client) => {
  client.on("ready", async () => {
    const { user, guilds, commands } = client;
    const prefix = config.prefix;

    logger.info(`${user.tag} has logged in.`);

    const setActivity = () => {
      const usersCount = guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      );
      const botGuilds = guilds.cache.size;
      const commandCount = commands.size;

      const activities = [
        `${prefix}help | ${prefix}invite`,
        `${commandCount} commands`,
        `${usersCount} users`,
        `${botGuilds} guilds`,
      ];

      const activity =
        activities[Math.floor(Math.random() * activities.length)];
      user.setPresence({
        activities: [{ name: activity, type: 3 }],
        status: "dnd",
      });
    };

    setActivity();
    setInterval(setActivity, 120000);
  });
};
