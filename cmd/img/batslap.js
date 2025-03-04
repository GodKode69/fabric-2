const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
  name: "batslap",
  aliases: [],
  description: "Slaps a user with a bat!",
  usage: `batslap [user mention or user ID]`,
  category: "fun",
  botPerms: [],
  userPerms: [],
  premium: false,
  vote: false,
  godkode: false,
  run: async (client, message, args) => {
    try {
      let user;
      if (args[0]) {
        const mention = message.mentions.users.first();
        if (mention) {
          user = mention;
        } else {
          user = await client.users.fetch(args[0]).catch(() => null);
          if (!user) {
            return message.reply("Please provide a valid user mention or ID.");
          }
        }
      } else {
        user = message.author;
      }

      const avatar = user.displayAvatarURL({ size: 512, dynamic: false, format: "png" });
      const authorAvatar = message.author.displayAvatarURL({ size: 512, dynamic: false, format: "png" });

      const img = await new DIG.Batslap().getImage(authorAvatar, avatar);
      const attach = new AttachmentBuilder(img, { name: "fabric-batslap.png" });

      const randomResponses = [
        `${message.author.username} slaps ${user.username} with a bat! 🦇`,
        `${user.username} just got slapped by ${message.author.username}! 💥`,
        `${message.author.username} delivers a bat slap to ${user.username}! 🦇💢`,
        `${user.username} didn't see that bat slap coming from ${message.author.username}! 🦇👋`,
        `${message.author.username} batslapped ${user.username} into next week! 🦇🚀`,
      ];
      const randomDescription = randomResponses[Math.floor(Math.random() * randomResponses.length)];

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(randomDescription)
        .setImage("attachment://fabric-batslap.png");

      await message.channel.send({ embeds: [embed], files: [attach] });
    } catch (error) {
      console.error("Error generating batslap image:", error);
      message.reply("There was an error generating the image. Please try again later.");
    }
  },
};