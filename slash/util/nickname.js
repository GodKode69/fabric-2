const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Change your own nickname in this server.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Your new nickname (emojis allowed)")
        .setRequired(true)
    ),
  category: "util",
  run: async (client, interaction) => {
    // Define our actionary for error responses.
    const responses = {
      tooLong: { description: "Nickname cannot exceed 32 characters." },
      notManageable: {
        description: "I cannot change your nickname due to role hierarchy.",
      },
    };

    const newNick = interaction.options.getString("name");
    if (newNick.length > 32) {
      return interaction.reply({
        embeds: [
          client.buildEmbed(
            client,
            +`${client.em.util.cross}` + responses.tooLong
          ),
        ],
        ephemeral: true,
      });
    }
    if (!interaction.member.manageable) {
      return interaction.reply({
        embeds: [
          client.buildEmbed(
            client,
            +`${client.em.util.cross}` + responses.notManageable
          ),
        ],
        ephemeral: true,
      });
    }

    // Change the nickname.
    await interaction.member.setNickname(newNick);
    return interaction.reply({
      embeds: [
        client.buildEmbed(client, {
          title: "Nickname Changed",
          description: `${client.emj.util.tick} | Your nickname has been changed to: **${newNick}**`,
        }),
      ],
      ephemeral: true,
    });
  },
};
