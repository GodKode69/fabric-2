/*const db = require("../../data/user/afk");
const buildEmbed = require("../../util/embed.js");
const moment = require("moment");

module.exports = async (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || message.author.system || !message.guild) return;
    if (message.content.trim().toLowerCase() === "afk") return;

    // Check if the user is AFK (local for this guild OR global)
    let data = await db.findOne({
      userId: message.author.id,
      $or: [{ guildId: message.guildId }, { Scope: "global" }],
    });

    if (data) {
      if (message.author.id === data.userId) {
        if (data.time) {
          const timeAgo = moment(data.time).fromNow();

          // Remove both the local and any global AFK statuses
          await db.deleteMany({
            userId: message.author.id,
            $or: [{ guildId: message.guildId }, { Scope: "global" }],
          });

          // Restore nickname:
          if (message.member) {
            // For global AFK, restore nickname in any guild
            if (data.Scope === "global") {
              if (message.member.displayName.startsWith("[AFK] ")) {
                message.member
                  .setNickname(data.originalNick || null)
                  .catch((err) =>
                    console.error("Couldn't restore nickname", err)
                  );
              }
            } else {
              // For local AFK, restore only if in the same guild where AFK was set
              if (data.originalNick && message.guild.id === data.guildId) {
                message.member
                  .setNickname(data.originalNick)
                  .catch((err) =>
                    console.error("Couldn't restore nickname", err)
                  );
              }
            }
          }

          return message.reply({
            embeds: [
              buildEmbed(client, {
                title: "AFK Removed",
                description: `Welcome back! I removed your AFK. You were AFK since \`${timeAgo}\`.`,
              }),
            ],
          });
        } else {
          console.error("Time field is undefined for user:", message.author.id);
          return message.reply("Your AFK time is not set correctly.");
        }
      }
    }

    // Check if a mentioned user is AFK
    const memberMentioned = message.mentions.users.first();
    if (memberMentioned) {
      data = await db.findOne({
        userId: memberMentioned.id,
        $or: [{ guildId: message.guildId }, { Scope: "global" }],
      });

      if (data) {
        if (data.time) {
          await message.reply({
            embeds: [
              buildEmbed(client, {
                title: "AFK Notice",
                description: `${
                  memberMentioned.tag
                } is AFK since <t:${Math.round(
                  data.time / 1000
                )}:R> for reason: \`${data.reason}\`.`,
              }),
            ],
          });
        } else {
          console.error(
            "Time field is undefined for mentioned user:",
            memberMentioned.id
          );
          return message.reply(
            "The mentioned user’s AFK time is not set correctly."
          );
        }

        // DM notification if enabled
        if (data.dmNotify) {
          let dmDescription = data.dmMessage
            ? data.dmMessage
            : `[Jump to message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`;
          memberMentioned
            .send({
              embeds: [
                buildEmbed(client, {
                  title: `You were mentioned in ${message.guild.name}`,
                  description: dmDescription,
                  fields: [
                    { name: "Content:", value: message.content || "None" },
                  ],
                }),
              ],
            })
            .catch(() => {});
        }
      }
    }
  });
};
*/