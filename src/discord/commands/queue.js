const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
        .setName('queue')
        .setDescription('Shows the current queue'),
    async execute(interaction, client) {
        try {
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;

            const currentTrack = client.queue && client.queue.currentTrack && client.queue.currentTrack;
            const tracks = client.queue && client.queue.tracks && client.queue.tracks.toArray();
            const fullQueue = [currentTrack, ...tracks];

            let embed = new EmbedBuilder();

            if (currentTrack) {
                let description = `🎧📋 **Queue: **\n\n`;
                fullQueue.forEach((track, index) => {
                    description += `${index + 1}. [${track.title}](${track.url})\n\n`;
                });

                embed
                    .setColor(0xe838cd)
                    .setTitle(`💿 Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(description);
            } else {
                embed
                    .setColor(0xe838cd)
                    .setTitle(`💿 Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(`🎧 Nothing is playing`);
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
};
