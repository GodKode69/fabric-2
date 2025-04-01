const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const mongoose = require("mongoose");

async function runPing(client, user, send) {
  const ws = client.ws.ping;
  const button = client.buildButton({
    label: "Additional Info",
    style: ButtonStyle.Secondary,
    customId: "add",
  });
  const row = new ActionRowBuilder().addComponents(button);
  const msg = await send(`Pong 🏓 | ${ws}ms`, { components: [row] });
  let dbPing = "N/A",
    apiPing;
  const dbStart = Date.now();
  try {
    await mongoose.connection.db.admin().ping();
    dbPing = Date.now() - dbStart;
  } catch (e) {
    console.error(e);
  }
  const apiStart = Date.now();
  await new Promise((r) => setTimeout(r, 30));
  apiPing = Date.now() - apiStart;
  const [gp, mp, bp] = [
    "https://cdn.discordapp.com/attachments/1247439613769945172/1279684945337385072/gp.png",
    "https://cdn.discordapp.com/attachments/1247439613769945172/1279684967919652915/1242650381192790046.png",
    "https://cdn.discordapp.com/attachments/1247439613769945172/1279684990346592308/1242650351237333127.png",
  ];
  const [ftImg, ftText] =
    ws > 500
      ? [bp, "Experiencing High Ping!"]
      : ws > 250
      ? [mp, "Experiencing Mediocre Ping."]
      : [gp, "Experiencing Good Ping."];
  const embed = client.buildEmbed(client, {
    title: "Latency Details",
    description: "Here are the detailed latency metrics:",
    fields: [
      {
        name: "Client",
        value: `\`\`\`yaml\n[ ${Math.round(ws)}ms ]\n\`\`\``,
        inline: true,
      },
      {
        name: "Database",
        value: `\`\`\`yaml\n[ ${dbPing}ms ]\n\`\`\``,
        inline: true,
      },
      {
        name: "Discord API",
        value: `\`\`\`yaml\n[ ${apiPing}ms ]\n\`\`\``,
        inline: true,
      },
    ],
    footer: { text: ftText, iconURL: ftImg },
  });
  return { msg, embed };
}

function attachCollector(msg, user, embed) {
  msg
    .createMessageComponentCollector({
      filter: (i) => {
        if (i.user.id === user.id) return true;
        i.reply({
          content: `Only **${user.tag}** can interact.`,
          ephemeral: true,
        });
        return false;
      },
      time: 100000,
      idle: 50000,
    })
    .on("collect", async (i) => {
      if (i.customId === "add")
        await i.update({ content: "", embeds: [embed], components: [] });
    });
}

module.exports = {
  name: "ping",
  aliases: ["pong", "speed"],
  description:
    "Retrieve the bot's latency including database and Discord API latency.",
  usage: "ping",
  category: "info",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      "Retrieve the bot's latency including database and Discord API latency."
    ),
  execute: async (client, ctx) => {
    if (typeof ctx.deferReply === "function") {
      await ctx.deferReply();
      const { embed } = await runPing(client, ctx.user, (c, o) =>
        ctx.editReply({ content: c, ...o })
      );
      attachCollector(await ctx.fetchReply(), ctx.user, embed);
    } else {
      const { msg, embed } = await runPing(client, ctx.author, (c, o) =>
        ctx.channel.send({ content: c, ...o })
      );
      attachCollector(msg, ctx.author, embed);
    }
  },
};
