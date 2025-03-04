const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
  name: "blink",
  aliases: [],
  description: "",
  usage: ``,
  category: "fun",
  botPerms: [],
  userPerms: [],
  premium: false,
  vote: false,
  godkode: false,
  run: async (client, message, args) => {
    const user = args[0] ? message.mentions.users.first() : message.author;
    const member = user;
    let avatar = member.displayAvatarURL({ size: 512, dynamic: true });
    let pngavatar = avatar.replace("webp", "png");
    let pngfirst = message.author.displayAvatarURL({
      size: 512,
      dynamic: true,
    });
    const img = await new DIG.Blink().getImage(5, pngfirst, pngavatar);
    const attach = new AttachmentBuilder(img, { name: "fabric-blink.webp" });
    let embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`Look At ${member.username}`)
      .setImage("attachment://fabric-blink.webp");
    let xddata = message.channel.send({ embeds: [embed], files: [attach] });
  },
};
