const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
} = require("discord.js");
const db = require("../../data/guild/guild");

module.exports = {
  name: "autodeleter",
  aliases: ["autodel"],
  description:
    "Automatically deletes any bot messages in the configured channel.",
  usage: "autodeleter [channelID] / autodeleter text [custom message]",
  category: "auto",
  execute: async (client, message, args) => {
    try {
      let guildData = await db.findOne({ guildId: message.guild.id });
      if (!guildData) {
        guildData = new db({
          guildId: message.guild.id,
          autoDelete: { enabled: false, id: "", text: "" },
        });
      }

      if (args[0]) {
        if (args[0].toLowerCase() === "text") {
          if (args[1]) {
            const customMessage = args.slice(1).join(" ");
            guildData.autoDelete.text = customMessage;
            await guildData.save();
            return message.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("#FFFFFF")
                  .setTitle("Auto Deleter")
                  .setDescription(
                    `Custom auto-delete message updated to: ${customMessage}`
                  ),
              ],
            });
          } else {
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("set_default")
                .setLabel("Default")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("help")
                .setLabel("Help")
                .setStyle(ButtonStyle.Secondary)
            );

            const sentMessage = await message.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("#FFFFFF")
                  .setTitle("Auto Deleter")
                  .setDescription("Please choose an option below:"),
              ],
              components: [row],
            });

            // Create a message component collector
            const collector = sentMessage.createMessageComponentCollector({
              componentType: ComponentType.Button,
              time: 15000, // Collector will listen for 15 seconds
            });

            collector.on("collect", async (interaction) => {
              if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                  content: "These buttons are not for you!",
                  ephemeral: true,
                });
              }

              if (interaction.customId === "set_default") {
                guildData.autoDelete.text =
                  "<#${message.channel.id}> has disabled bot messages.";
                await guildData.save();
                await interaction.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("#FFFFFF")
                      .setTitle("Auto Deleter")
                      .setDescription("Auto delete message set to default."),
                  ],
                  components: [],
                });
              } else if (interaction.customId === "help") {
                await interaction.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("#FFFFFF")
                      .setTitle("Auto Deleter Help")
                      .setDescription(
                        "Use 'autodeleter text [your custom message]' to set a custom auto-delete message. Use '[CHANNEL]' to mention the channel."
                      ),
                  ],
                  components: [],
                });
              }
            });

            collector.on("end", (collected) => {
              if (collected.size === 0) {
                sentMessage.edit({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("#FFFFFF")
                      .setTitle("Auto Deleter")
                      .setDescription(
                        "No interaction received within the time limit."
                      ),
                  ],
                  components: [],
                });
              }
            });

            return;
          }
        } else {
          const channelID = args[0].replace(/<#!?(\d+)>/, "$1");
          const channel = client.channels.cache.get(channelID);
          if (!channel) {
            return message.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("#FFFFFF")
                  .setTitle("Auto Deleter")
                  .setDescription(
                    "Invalid channel. Please ensure the channel exists and is accessible."
                  ),
              ],
            });
          }

          guildData.autoDelete.enabled = true;
          guildData.autoDelete.id = channelID;
          await guildData.save();

          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#FFFFFF")
                .setTitle("Auto Deleter")
                .setDescription(`Auto delete enabled for <#${channelID}>.`),
            ],
          });
        }
      } else {
        guildData.autoDelete.enabled = !guildData.autoDelete.enabled;
        guildData.autoDelete.id = guildData.autoDelete.enabled
          ? message.channel.id
          : "";
        await guildData.save();

        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FFFFFF")
              .setTitle("Auto Deleter")
              .setDescription(
                `Auto delete has been ${
                  guildData.autoDelete.enabled ? "enabled" : "disabled"
                } for this channel.`
              ),
          ],
        });
      }
    } catch (error) {
      console.error("Auto Deleter Error:", error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFFFFF")
            .setTitle("Auto Deleter")
            .setDescription(`An error occurred: \`${error.message}\``),
        ],
      });
    }
  },
};
