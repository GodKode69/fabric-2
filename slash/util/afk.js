/*const { SlashCommandBuilder } = require("discord.js");
const db = require("../../data/user/afk.js");
const buildEmbed = require("../../util/embed.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set your status to AFK.")
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for being AFK")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("dm_notify")
        .setDescription("Receive DM notifications on mentions?")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("scope")
        .setDescription("Select your AFK scope")
        .setRequired(false)
        .addChoices(
          { name: "Local", value: "local" },
          { name: "Global", value: "global" }
        )
    ),
  run: async (client, interaction) => {
    await interaction.deferReply();
    // Check if user is already AFK (local or global)
    const existing = await db.findOne({
      userId: interaction.user.id,
      $or: [{ guildId: interaction.guildId }, { Scope: "global" }],
    });
    if (existing) {
      return interaction.editReply("You're already AFK.");
    }

    // Retrieve options with defaults
    let reason = interaction.options.getString("reason");
    const dmNotify = interaction.options.getBoolean("dm_notify");
    const scope = interaction.options.getString("scope") || "local";
    const afkMessages = [
      "💤 Catching some Z's, be back later!",
      "🐱‍👤 Sneaking away for a bit!",
      "🎮 AFK, probably gaming or napping!",
      "☕ Brb, need my caffeine fix!",
      "🐸 Gone frog watching, croak ya later!",
      "🌸 Taking a short break, miss me?",
      "✨ AFK, manifesting good vibes!",
      "🚀 Off to space, be back soon!",
      "🍕 AFK, pizza emergency!",
      "🐶 Playing with a cute doggo, don't miss me too much!",
    ];
    if (!reason) {
      reason = afkMessages[Math.floor(Math.random() * afkMessages.length)];
    }

    // Disallow links and mentions in the reason
    const disallowed = [
      "https",
      "http",
      "discord.gg",
      ".gg/",
      "gg/",
      ".com",
      ".net",
      ".org",
      ".co",
      ".xyz",
      ".tk",
      ".io",
      ".gl",
      ".ly",
      ".me",
      ".party",
      ".support",
      ".tech",
      ".website",
      ".space",
      ".site",
      ".store",
      ".fun",
      ".host",
      ".press",
      ".digital",
      ".world",
      ".app",
      ".online",
    ];
    if (disallowed.some((x) => reason.includes(x))) {
      return interaction.editReply(
        "You cannot use links/advertise in your AFK reason."
      );
    }
    if (reason.match(/<@!?(\d+)>/)) {
      return interaction.editReply(
        "You can't mention members in your AFK reason."
      );
    }

    // Automatic Nickname Tagging: add [AFK] prefix if possible and store original nickname
    let originalNick = interaction.member.nickname || interaction.user.username;
    if (
      interaction.member.manageable &&
      !interaction.member.displayName.startsWith("[AFK] ")
    ) {
      try {
        await interaction.member.setNickname(
          `[AFK] ${interaction.member.displayName}`
        );
      } catch (err) {
        console.error("Error updating nickname:", err);
        originalNick = null;
      }
    } else {
      originalNick = null;
    }

    // Save the AFK status in the database
    const newData = new db({
      guildId: interaction.guildId,
      userId: interaction.user.id,
      reason: reason,
      time: Date.now(),
      Scope: scope,
      originalNick: originalNick,
      dmNotify: dmNotify === null || dmNotify === undefined ? true : dmNotify,
    });
    await newData.save();

    // Confirm AFK status via an embed
    const embed = buildEmbed(client, {
      title: "AFK Set",
      description:
        scope === "global"
          ? `${client.emojis.util.tick} You are now globally AFK for \`${reason}\``
          : `${client.emojis.util.tick} You are now AFK for \`${reason}\``,
    });

    return interaction.editReply({ embeds: [embed] });
  },
};
*/