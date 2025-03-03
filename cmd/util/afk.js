const db = require("../../data/user/afk.js");
const { ActionRowBuilder, ButtonStyle } = require("discord.js");
const { buildButton } = require("../../util/button.js");
const buildEmbed = require("../../util/embed.js");

module.exports = {
  name: "afk",
  aliases: ["away"],
  description: "Set your status to AFK.",
  usage: "afk [reason]",
  category: "util",
  run: async (client, message, args) => {
    // Check if user is already AFK in this guild
    const data = await db.findOne({
      guildId: message.guildId,
      userId: message.author.id,
    });
    if (data) {
      return message.channel.send("You're already AFK.");
    }

    // Determine AFK reason (or pick a random one)
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
    const reason =
      args.join(" ") ||
      afkMessages[Math.floor(Math.random() * afkMessages.length)];

    // Prevent links or mentions in the reason
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
      await message.delete();
      return message.channel
        .send("**You can't use links/advertise in your AFK reason**")
        .then((msg) => setTimeout(() => msg.delete(), 5000));
    }
    if (message.mentions.members.first()) {
      return message.channel
        .send("**You can't @mention members in your AFK reason**")
        .then((msg) => setTimeout(() => msg.delete(), 5000));
    }

    // Automatic Nickname Tagging: save the current nickname and add "[AFK]" prefix if possible
    let originalNick = message.member.nickname || message.member.user.username;
    if (
      message.member.manageable &&
      !message.member.displayName.startsWith("[AFK] ")
    ) {
      try {
        await message.member.setNickname(`[AFK] ${message.member.displayName}`);
      } catch (error) {
        console.error("Error updating nickname:", error);
        originalNick = null;
      }
    } else {
      originalNick = null;
    }

    // Default DM notification flag
    let dmNotify = true;

    // Build buttons for scope selection and DM toggle using our custom builder
    const globalButton = buildButton({
      customId: "global",
      label: "Global",
      style: ButtonStyle.Secondary,
    });
    const localButton = buildButton({
      customId: "local",
      label: "Local",
      style: ButtonStyle.Primary,
    });
    const dmButton = buildButton({
      customId: "toggle_dm",
      label: `DM ${dmNotify ? "✅" : "❌"}`,
      style: ButtonStyle.Secondary,
    });
    let row = new ActionRowBuilder().addComponents(
      globalButton,
      localButton,
      dmButton
    );

    // Send confirmation prompt
    const confirmationMessage = await message.reply({
      content: "Please choose your AFK scope:",
      components: [row],
    });

    // Create collector for button interactions (only from the message author)
    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = confirmationMessage.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "toggle_dm") {
        // Toggle DM notification and update button label
        dmNotify = !dmNotify;
        dmButton.setLabel(`DM ${dmNotify ? "✅" : "❌"}`);
        row = new ActionRowBuilder().addComponents(
          globalButton,
          localButton,
          dmButton
        );
        return interaction.update({ components: [row] });
      }

      // When user chooses a scope ("global" or "local")
      await interaction.deferUpdate();
      const scope = interaction.customId; // "global" or "local"

      // Save the AFK data
      const newData = new db({
        guildId: message.guildId,
        userId: message.author.id,
        reason: reason,
        time: Date.now(),
        Scope: scope,
        originalNick: originalNick,
        dmNotify: dmNotify,
      });
      await newData.save();
      collector.stop("selected");

      // Use our embed builder for confirmation
      const embed = buildEmbed(client, {
        title: "AFK Set",
        description:
          scope === "global"
            ? `${client.emojis.util.tick} You are now globally AFK for \`${reason}\``
            : `${client.emojis.util.tick} You are now AFK for \`${reason}\``,
      });
      return confirmationMessage.edit({
        content: "",
        embeds: [embed],
        components: [],
      });
    });

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        // Finalize with default local scope if no selection was made
        const newData = new db({
          guildId: message.guildId,
          userId: message.author.id,
          reason: reason,
          time: Date.now(),
          Scope: "local",
          originalNick: originalNick,
          dmNotify: dmNotify,
        });
        await newData.save();
        const embed = buildEmbed(client, {
          title: "AFK Set",
          description: `${client.emojis.util.exclaim} No response received. You are now AFK (Local) for \`${reason}\``,
        });
        return confirmationMessage.edit({
          content: "",
          embeds: [embed],
          components: [],
        });
      }
    });
  },
};
