const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
  name: "confused",
  aliases: [],
  description: "",
  usage: ``,
  category: "fun",
  botPerms: [],
  userPerms: [],
  premium: false,
  godkode: false,
  run: async (client, message, args) => {
    const user = args[0] ? message.mentions.users.first() : message.author;
    const member = user;
    let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
    let pngavatar = avatar.replace("webp", "png");
    const img = await new DIG.ConfusedStonk().getImage(pngavatar);
    const attach = new AttachmentBuilder(img, { name: "fabric-confused.png" });
    let embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`Look At ${member.username}`)
      .setImage("attachment://fabric-confused.png");
    let xddata = message.channel.send({ embeds: [embed], files: [attach] });
  },
};