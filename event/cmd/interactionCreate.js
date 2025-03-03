// event/cmd/interactionCreate.js

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    // Only process slash commands.
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        content: "Command not found.",
        ephemeral: true,
      });
    }

    try {
      // Run the slash command (additional checks can be placed here if needed).
      await command.run(client, interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply(
          "There was an error executing the command."
        );
      } else {
        await interaction.reply({
          content: "There was an error executing the command.",
          ephemeral: true,
        });
      }
    }
  },
};
