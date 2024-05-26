const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('See which song is currently playing'),
    async execute(interaction, client) {
        try {
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;

           
            const currentTrack = client.queue && client.queue.currentTrack && client.queue.currentTrack;
            const title = currentTrack? currentTrack.title : "Nothing is playing";
            const image = currentTrack? currentTrack.thumbnail : "";

            let embed = new EmbedBuilder();

            if (currentTrack && title && image) {
                embed
                    .setColor(0xe838cd)
                    .setTitle(`Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(`🎧 **Now playing:**\n${title}`)
                    .setImage(image);
            }else {
                embed
                    .setColor(0xe838cd)
                    .setTitle(`Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(`🎧 **Now playing:**\n${title}`)
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
};
