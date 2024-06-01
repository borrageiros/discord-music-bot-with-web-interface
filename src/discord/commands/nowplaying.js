const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const deleteAfterTimeout = require('../../middlewares/delete.discord.messages');

function getSourceString(input) {
  const sources = {
    "youtube": "🔴YouTube",
    "spotify": "🟢Spotify",
    "soundcloud": "🟠SoundCloud",
    "apple_music": "🟣AppleMusic",
  };
  return sources[input] || undefined;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('See which song is currently playing'),
  async execute(interaction, client) {
    try {
      const botMember = interaction.guild.members.cache.get(client.user.id);
      const botName = botMember ? botMember.displayName : client.user.username;

      const currentTrack = client.queues[interaction.guildId] && client.queues[interaction.guildId].currentTrack && client.queues[interaction.guildId].currentTrack;
      const title = currentTrack && currentTrack.title;
      const image = currentTrack && currentTrack.thumbnail;
      const url = currentTrack && currentTrack.url;
      const source = currentTrack && currentTrack.raw && currentTrack.raw.source;

      let embed = new EmbedBuilder();
      let row = new ActionRowBuilder();
      let message = null;

      if (currentTrack && title && image && url && source) {
        embed
          .setColor(0xe838cd)
          .setTitle(title)
          .setURL(url)
          .setDescription(`🎧 **Now playing** on ${getSourceString(source)}`)
          .setImage(image);

        row.addComponents(
          new ButtonBuilder()
            .setCustomId('send_embed_dm')
            .setLabel('💾 Save this song in private messages')
            .setStyle(ButtonStyle.Primary)
        );

        message = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const filter = i => i.customId === 'send_embed_dm' && i.user.id === interaction.user.id;
        const deleteButtonAfter = process.env.DELETE_MESSAGES_AFTER ? process.env.DELETE_MESSAGES_AFTER : 15000;
        const collector = message.createMessageComponentCollector({ filter, time: deleteButtonAfter });

        collector.on('collect', async i => {
          if (i.customId === 'send_embed_dm') {
            await i.deferUpdate();
            await i.user.send({ embeds: [embed] });
            await i.followUp({ embeds: [new EmbedBuilder().setTitle('✅ Song saved in DMs').setColor(0xe838cd)], ephemeral: true });
          }
        });

        // Delete button
        setTimeout(() => message.edit({ components: [] }), deleteButtonAfter);
      } else {
        embed
          .setColor(0xe838cd)
          .setTitle(`💿 Click here to open "${botName}" interface`)
          .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
          .setDescription(`🔴 There is nothing playing!`);
        message = await interaction.reply({ embeds: [embed], ephemeral: true });
        deleteAfterTimeout(message);
      }
    } catch (error) {
      console.error(error);
    }
  }
};
