const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
  name: "lisa",
  aliases: [],
  description: "",
  usage: ``,
  category: "fun",
  botPerms: [],
  userPerms: [],
  premium: false,
  godkode: false,
  run: async (client, message, args) => {
    const text = args.slice(0).join(" ");
    const img = await new DIG.LisaPresentation().getImage(text);
    const attach = new AttachmentBuilder(img, { name: "fabric-lisa.png" });
    let embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`Look At This!`)
      .setImage("attachment://fabric-lisa.png");
    let xddata = message.channel.send({ embeds: [embed], files: [attach] });
  },
};
