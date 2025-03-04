const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
  name: "ad",
  aliases: [],
  description: "Creates an ad for the mentioned user, user ID, or yourself.",
  usage: `ad [user mention / ID]`,
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

      const img = await new DIG.Ad().getImage(avatar);
      const attach = new AttachmentBuilder(img, { name: "fabric-ad.png" });

      const randomResponses = [
        `${user.username} is taking over the world! 🌍`,
        `Have you seen ${user.username}? They're everywhere! 🚀`,
        `${user.username} is the star of the show! 🌟`,
        `Everyone's talking about ${user.username}! 🎤`,
        `${user.username} is the face of the future! 🔮`,
        `Look who's making waves—${user.username}! 🌊`,
      ];
      const randomDescription = randomResponses[Math.floor(Math.random() * randomResponses.length)];

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(randomDescription)
        .setImage("attachment://fabric-ad.png");

      await message.channel.send({ embeds: [embed], files: [attach] });
    } catch (error) {
      console.error("Error generating ad:", error);
      message.reply("There was an error generating the ad. Please try again later.");
    }
  },
};