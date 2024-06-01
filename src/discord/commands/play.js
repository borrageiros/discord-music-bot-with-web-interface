const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType, Track } = require('discord-player');
const deleteAfterTimeout = require('../../middlewares/delete.discord.messages');
const { GuildQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music by the given song name or song link')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('URL or track name to play')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('source')
        .setDescription('(OPTIONAL)(Default: "youtube") Sources for search: "youtube", "spotify", "soundcloud" or "apple"]')
        .setRequired(false)
    ),
  async execute(interaction, client) {
    try {
      const botMember = interaction.guild.members.cache.get(client.user.id);
      const botName = botMember ? botMember.displayName : client.user.username;
      const query = interaction.options.getString('song');
      const source = interaction.options.getString('source');
      let results;
      if (source) {
        switch (source) {
          case "youtube": {
            results = await client.player.search(query, { searchEngine: QueryType.YOUTUBE_SEARCH });
            break;
          };
          case "spotify": {
            results = await client.player.search(query, { searchEngine: QueryType.SPOTIFY_SEARCH });
            break;
          };
          case "soundcloud": {
            results = await client.player.search(query, { searchEngine: QueryType.SOUNDCLOUD_SEARCH });
            break;
          };
          case "apple": {
            results = await client.player.search(query, { searchEngine: QueryType.APPLE_MUSIC_SEARCH });
            break;
          };
          default: {
            results = await client.player.search(query, { searchEngine: QueryType.YOUTUBE_SEARCH });
          }
        }
      } else {
        results = await client.player.search(query, { searchEngine: QueryType.YOUTUBE_SEARCH });
      }

      let embed = new EmbedBuilder();
      let ephemeral = false;

      const voiceChannel = interaction.member.voice.channel;

      try {
        if (voiceChannel) {
          // Create Queue if not exist
          if (!client.queues[interaction.guildId]) { client.queues[interaction.guildId] = new GuildQueue(client.player, {}); }

          // Connect to the channel if not already connected
          if (client.queues[interaction.guildId] && !client.queues[interaction.guildId].connection) await client.queues[interaction.guildId].connect(voiceChannel.id);

          // Add track
          const track = new Track(client.player, results.tracks[0]);
          client.queues[interaction.guildId].addTrack(track);
          if (!client.queues[interaction.guildId].isPlaying()) await client.queues[interaction.guildId].node.play();
          client.queues[interaction.guildId].filters.volume.setVolume(client.defaultVolume);

          // Reply
          const image = track.thumbnail;
          const title = track.title;

          if (image && title) {
            embed = new EmbedBuilder()
              .setColor(0xe838cd)
              .setTitle(`💿 Click here to open "${botName}" interface`)
              .setURL(process.env.DOMAIN + `/?guild=${interaction.guildId}`)
              .setDescription(`⏯ **Song added!**\n${title}`)
              .setImage(image);
          } else {
            embed = new EmbedBuilder()
              .setColor(0xe838cd)
              .setTitle(`💿 Click here to open "${botName}" interface`)
              .setURL(process.env.DOMAIN + `/?guild=${interaction.guildId}`)
              .setDescription(`⏯ **Song added!**`);
          }
        } else {
          embed
            .setColor(0xe838cd)
            .setTitle(`💿 Click here to open "${botName}" interface`)
            .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
            .setDescription(`🔴 You need to be in a voice channel to use this command!`);
          ephemeral = true;
        }
      } catch {
        embed
          .setColor(0xe838cd)
          .setTitle(`💿 Click here to open "${botName}" interface`)
          .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
          .setDescription(`🔴 Something went wrong: I cant connect to the voice channel... try again`);
        ephemeral = true;
      }

      const message = await interaction.reply({ embeds: [embed], ephemeral: ephemeral });
      deleteAfterTimeout(message);
    } catch (error) {
      console.error(error);
    }
  }
};
