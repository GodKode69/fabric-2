const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
  name: "affect",
  aliases: [],
  description: "Creates a 'affect' meme for the mentioned user, user ID, or yourself.",
  usage: `affect [user mention or user ID]`,
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

      const img = await new DIG.Affect().getImage(avatar);
      const attach = new AttachmentBuilder(img, { name: "fabric-affect.png" });

      const randomResponses = [
        `${user.username} is feeling all the emotions! 😭`,
        `${user.username} is having a moment... 🎭`,
        `${user.username} is the star of this emotional rollercoaster! 🎢`,
        `Look at ${user.username}, they're so dramatic! 🎬`,
        `${user.username} is the face of pure emotion! 🖼️`,
        `${user.username} is stealing the show with their feelings! 🎭`,
      ];
      const randomDescription = randomResponses[Math.floor(Math.random() * randomResponses.length)];

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(randomDescription)
        .setImage("attachment://fabric-affect.png");

      await message.channel.send({ embeds: [embed], files: [attach] });
    } catch (error) {
      console.error("Error generating 'affect' image:", error);
      message.reply("There was an error generating the image. Please try again later.");
    }
  },
};