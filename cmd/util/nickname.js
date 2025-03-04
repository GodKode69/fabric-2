module.exports = {
  name: "nickname",
  aliases: ["nick"],
  description: "Change your own nickname in this server.",
  usage: "nickname <new nickname>",
  category: "util",
  ownerOnly: false,
  disabled: false,
  botPerms: ["ManageNicknames"],
  userPerms: [],
  run: async (client, message, args) => {
    // Define our actionary for error responses.
    const responses = {
      noNick: { description: "Please provide a new nickname." },
      tooLong: { description: "Nickname cannot exceed 32 characters." },
      notManageable: {
        description: "I cannot change your nickname due to role hierarchy.",
      },
    };

    // Build new nickname from arguments.
    const newNick = args.join(" ");
    if (!newNick) {
      return message.reply({
        embeds: [
          client.buildEmbed(
            client,
            +`${client.em.util.cross}` + responses.noNick
          ),
        ],
      });
    }
    if (newNick.length > 32) {
      return message.reply({
        embeds: [
          client.buildEmbed(
            client,
            +`${client.em.util.cross}` + responses.tooLong
          ),
        ],
      });
    }
    if (!message.member.manageable) {
      return message.reply({
        embeds: [
          client.buildEmbed(
            client,
            +`${client.em.util.cross}` + responses.notManageable
          ),
        ],
      });
    }

    // Change the nickname.
    await message.member.setNickname(newNick);
    return message.channel.send({
      embeds: [
        client.buildEmbed(client, {
          title: "Nickname Changed",
          description: `${client.emj.util.tick} | Your nickname has been changed to: **${newNick}**`,
        }),
      ],
    });
  },
};
