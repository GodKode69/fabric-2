const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
  name: "spank",
  aliases: [],
  description: "",
  usage: ``,
  category: "fun",
  botPerms: [],
  userPerms: [],
  vote: true,
  godkode: false,
  run: async (client, message, args) => {
    const user = args[0] ? message.mentions.users.first() : message.author;
    const member = user;
    let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
    let pngavatar = avatar.replace("webp", "png");
    let first = message.author.displayAvatarURL({ size: 512, dynamic: false });
    let pngfirst = first.replace("webp", "png");
    const img = await new DIG.Spank().getImage(pngfirst, pngavatar);
    const attach = new AttachmentBuilder(img, { name: "fabric-spank.png" });
    let embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`Look At ${member.username}`)
      .setImage("attachment://fabric-spank.png");
    let xddata = message.channel.send({ embeds: [embed], files: [attach] });
  },
};