const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
            let deleteMessage = false;

            if (currentTrack && title && image && url && source) {
                embed
                    .setColor(0xe838cd)
                    .setTitle(title)
                    .setURL(url)
                    .setDescription(`🎧 **Now playing** on ${getSourceString(source)}`)
                    .setImage(image);
            }else {
                embed
                    .setColor(0xe838cd)
                    .setTitle(`💿 Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(`🔴 There is nothing playing!`);
                deleteMessage = true;
            }

            const message = await interaction.reply({ embeds: [embed], ephemeral: true  });
            if (deleteMessage) { deleteAfterTimeout(message) }
        } catch (error) {
            console.error(error);
        }
    }
};
