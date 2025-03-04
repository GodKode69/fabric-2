const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
  name: "beautiful",
  aliases: [],
  description: "Shows how beautiful a user is!",
  usage: `beautiful [user mention or user ID]`,
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
      const img = await new DIG.Beautiful().getImage(avatar);
      const attach = new AttachmentBuilder(img, { name: "fabric-beautiful.png" });

      const randomResponses = [
        `${user.username} is absolutely stunning! ✨`,
        `Wow, ${user.username} is breathtaking! 🌟`,
        `${user.username} is the definition of beauty! 💖`,
        `Look at how beautiful ${user.username} is! 🌸`,
        `${user.username} is shining like a star! ⭐`,
      ];
      const randomDescription = randomResponses[Math.floor(Math.random() * randomResponses.length)];

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(randomDescription)
        .setImage("attachment://fabric-beautiful.png");

      await message.channel.send({ embeds: [embed], files: [attach] });
    } catch (error) {
      console.error("Error generating beautiful image:", error);
      message.reply("There was an error generating the image. Please try again later.");
    }
  },
};