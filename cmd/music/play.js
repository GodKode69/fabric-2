const { LoadType } = require("kazagumo");

module.exports = {
  name: "play",
  description: "Play a song using Kazagumo and Lavalink.",
  usage: "play <song name | URL>",
  category: "music",
  execute: async (client, msg, args) => {
    // Check if user is in a voice channel.
    const voiceChannel = msg.member.voice?.channel;
    if (!voiceChannel) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: "You must be in a voice channel to use this command.",
          }),
        ],
      });
    }

    // Get the search query.
    const query = args.join(" ");
    if (!query) {
      return msg.reply({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description: "Please provide a song name or URL to search for.",
          }),
        ],
      });
    }
    // If query isn't a URL, decide which search engine to use.
    const lowerQuery = query.toLowerCase();
    const finalQuery = query.match(/^https?:\/\//) ? query : "spotify:" + query;

    // Send an embed indicating the search is in progress.
    const searchMsg = await msg.channel.send({
      embeds: [
        client.buildEmbed(client, {
          title: "Searching",
          description: `Searching for **${query}**...`,
        }),
      ],
    });

    // Get or create a player.
    let player = client.kazagumo.players.get(msg.guild.id);
    if (!player) {
      try {
        player = await client.kazagumo.createPlayer({
          guildId: msg.guild.id,
          textId: msg.channel.id,
          voiceId: voiceChannel.id,
          volume: 40,
          deaf: true
        });
      } catch (error) {
        console.error("Error creating player:", error);
        return msg.reply({
          embeds: [
            client.buildEmbed(client, {
              title: "Error",
              description: "There was an error creating the player.",
            }),
          ],
        });
      }
    }

    // Search for the track.
    let result;
    try {
      result = await client.kazagumo.search(finalQuery, {
        requester: msg.author,
      });
    } catch (error) {
      console.error("Search error:", error);
      return searchMsg.edit({
        embeds: [
          client.buildEmbed(client, {
            title: "Error",
            description:
              "There was an error searching for the track (timeout or network issue).",
          }),
        ],
      });
    }

    // Validate result.
    if (!result.tracks || result.tracks.length === 0) {
      return searchMsg.edit({
        embeds: [
          client.buildEmbed(client, {
            title: "No Results",
            description: "No matches found for your query.",
          }),
        ],
      });
    }

    // Process the result.
    let track;
    if (result.loadType === "PLAYLIST") {
      // Add entire playlist.
      player.queue.add(result.tracks);
      searchMsg.edit({
        embeds: [
          client.buildEmbed(client, {
            title: "Playlist Queued",
            description: `Queued ${result.tracks.length} tracks from ${result.playlistName}.`,
          }),
        ],
      });
    } else {
      // For TRACK or SEARCH, take the first track.
      track = result.tracks[0];
      player.queue.add(track);
      searchMsg.edit({
        embeds: [
          client.buildEmbed(client, {
            title: "Track Queued",
            description: `Queued [${track.title}](${track.uri}).`,
          }),
        ],
      });
    }

    // Start playback if not playing.
    if (!player.playing && !player.paused) {
      // Get next track from queue.
      const nextTrack = player.queue.shift();
      try {
        player.play(nextTrack); // In Kazagumo, play() plays the next track.
      } catch (error) {
        console.error("Error starting playback:", error);
        return msg.channel.send({
          embeds: [
            client.buildEmbed(client, {
              title: "Error",
              description: "There was an error starting playback.",
            }),
          ],
        });
      }
    }
  },
};
