const guildDB = require("../../data/guild/guild.js");

module.exports = {
  name: "guildnoprefix",
  aliases: ["gnop", "guildnop"],
  description: "Activates or deactivates no-prefix for everyone on the server.",
  usage: "gnop <enable | disable | status>",
  category: "util",
  run: async (client, message, args) => {
    const guildId = message.guild.id;

    // Retrieve guild data, or create new if it doesn't exist
    let guildData = await guildDB.findOne({ guildId: guildId });
    if (!guildData) {
      guildData = new guildDB({ guildId: guildId });
      await guildData.save();
    }

    // If no argument provided
    if (!args[0]) {
      const embed = client.buildEmbed({
        title: "Invalid Usage",
        description: `${client.emj.util.cross} | Please provide an option: activate, deactivate, or show.`,
      });
      return message.channel.send({ embeds: [embed] });
    }

    const action = args[0].toLowerCase();

    // Option: Activate/Enable/Add no-prefix
    if (["activate", "enable", "add"].includes(action)) {
      // Check if premium is active
      if (!guildData.premium || !guildData.premium.enabled) {
        const embed = client.buildEmbed({
          title: "Premium Required",
          description: `${client.emj.util.exclaim} | This feature is premium only.`,
        });
        return message.channel.send({ embeds: [embed] });
      }

      // Check if no-prefix is already active
      if (guildData.noPrefix && guildData.noPrefix.enabled) {
        const embed = client.buildEmbed({
          title: "No-Prefix Already Active",
          description: `${client.emj.util.exclaim} | No-prefix is already activated.`,
        });
        return message.channel.send({ embeds: [embed] });
      }

      // Activate no-prefix and update database
      guildData.noPrefix = { enabled: true, user: message.author.id };
      await guildData.save();

      const embed = client.buildEmbed({
        title: "No-Prefix Activated",
        description: `${client.emj.util.tick} | No-prefix has been successfully activated.`,
      });
      return message.channel.send({ embeds: [embed] });

      // Option: Deactivate/Disable/Remove no-prefix
    } else if (["disable", "deactivate", "remove"].includes(action)) {
      // Check if no-prefix is already inactive
      if (!guildData.noPrefix || !guildData.noPrefix.enabled) {
        const embed = client.buildEmbed({
          title: "No-Prefix Already Inactive",
          description: `${client.emj.util.cross} | No-prefix is already deactivated.`,
        });
        return message.channel.send({ embeds: [embed] });
      }

      // Deactivate no-prefix and update database
      guildData.noPrefix.enabled = false;
      // Optionally, clear the user who activated it:
      guildData.noPrefix.user = null;
      await guildData.save();

      const embed = client.buildEmbed({
        title: "No-Prefix Deactivated",
        description: `${client.emj.util.tick} No-prefix has been successfully deactivated.`,
      });
      return message.channel.send({ embeds: [embed] });

      // Option: View/Show/Status of no-prefix
    } else if (["view", "show", "status"].includes(action)) {
      const premiumStatus =
        guildData.premium && guildData.premium.enabled ? "Enabled" : "Disabled";
      const noPrefixStatus =
        guildData.noPrefix && guildData.noPrefix.enabled
          ? "Enabled"
          : "Disabled";
      const premiumExpiry = guildData.premium && guildData.premium.expiresAt;

      const embed = client.buildEmbed({
        title: "No-Prefix Status",
        description: `**Premium:** ${premiumStatus}\n**Premium Expiry:** ${premiumExpiry}\n**No-Prefix:** ${noPrefixStatus}`,
      });
      return message.channel.send({ embeds: [embed] });

      // Invalid option provided
    } else {
      const embed = client.buildEmbed({
        title: "Invalid Option",
        description: `${client.emj.util.cross} | Invalid option provided. Use add, remove, or view.`,
      });
      return message.channel.send({ embeds: [embed] });
    }
  },
};
