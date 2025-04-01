const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

/**
 * Paginates an array of embed pages.
 *
 * @param {Object} options
 * @param {Message} options.message - The message object to edit (must be already sent).
 * @param {string} options.userId - The user ID allowed to interact with the paginator.
 * @param {Array} options.pages - An array of EmbedBuilder instances.
 * @param {number} [options.time=60000] - Collector timeout in milliseconds.
 */
async function paginate({ message, userId, pages, time = 60000 }) {
  let currentPage = 0;

  // Create paginator buttons.
  const prevButton = new ButtonBuilder()
    .setCustomId("prevPage")
    .setLabel("Previous")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);
  const nextButton = new ButtonBuilder()
    .setCustomId("nextPage")
    .setLabel("Next")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(pages.length <= 1);
  const deleteButton = new ButtonBuilder()
    .setCustomId("deletePage")
    .setLabel("Delete")
    .setStyle(ButtonStyle.Danger);
  let buttonRow = new ActionRowBuilder().addComponents(
    prevButton,
    nextButton,
    deleteButton
  );

  // Send the initial page.
  await message.edit({ embeds: [pages[currentPage]], components: [buttonRow] });

  const collector = message.createMessageComponentCollector({
    filter: (i) => i.user.id === userId,
    time,
  });

  collector.on("collect", async (interaction) => {
    if (interaction.customId === "deletePage") {
      await interaction.update({
        content: "Pagination ended.",
        components: [],
      });
      return collector.stop();
    } else if (interaction.customId === "prevPage") {
      currentPage = Math.max(currentPage - 1, 0);
    } else if (interaction.customId === "nextPage") {
      currentPage = Math.min(currentPage + 1, pages.length - 1);
    }
    // Update button disabled states.
    prevButton.setDisabled(currentPage === 0);
    nextButton.setDisabled(currentPage === pages.length - 1);
    buttonRow = new ActionRowBuilder().addComponents(
      prevButton,
      nextButton,
      deleteButton
    );

    await interaction.update({
      embeds: [pages[currentPage]],
      components: [buttonRow],
    });
  });

  collector.on("end", async () => {
    try {
      await message.edit({ components: [] });
    } catch (err) {
      logger.error("Failed to disable paginator buttons:", err);
    }
  });
}

module.exports = { paginate };
