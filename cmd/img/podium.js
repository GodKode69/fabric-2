const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
  name: "podium",
  aliases: [],
  description: "",
  usage: ``,
  category: "fun",
  botPerms: [],
  userPerms: [],
  premium: false,
  godkode: false,
  run: async (client, message, args) => {
    const member = args[0] ? message.mentions.users.first() : message.author;
    const mentionedUsers = [...message.mentions.users.values()];
    const user = args[1] ? mentionedUsers[1] : message.author;
    let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
    let pngavatar = avatar.replace("webp", "png");
    let first = message.author.displayAvatarURL({ size: 512, dynamic: false });
    let pngfirst = first.replace("webp", "png");
    let second = user.displayAvatarURL({ size: 512, dynamic: false });
    let pngsecond = second.replace("webp", "png");
    const img = await new DIG.Podium().getImage(
      pngavatar,
      pngfirst,
      pngsecond,
      user.username,
      member.username,
      message.author.username
    );
    const attach = new AttachmentBuilder(img, { name: "fabric-podium.png" });
    let embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`Look At ${member.username}`)
      .setImage("attachment://fabric-podium.png");
    let xddata = message.channel.send({ embeds: [embed], files: [attach] });
  },
};
