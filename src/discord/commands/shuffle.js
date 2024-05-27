const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Toggle the shuffle mode on the current queue'),
    async execute(interaction, client) {
        try {
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;

            let embed = new EmbedBuilder();

            if (client.queue.isPlaying()) {
                if (!client.queue.isShuffling) {
                    embed
                        .setColor(0xe838cd)
                        .setTitle(`💿 Click here to open "${botName}" interface`)
                        .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                        .setDescription(`🟢🔀 Shuffle mode enabled`);
                }else {
                    embed
                        .setColor(0xe838cd)
                        .setTitle(`💿 Click here to open "${botName}" interface`)
                        .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                        .setDescription('🔴🔀 Shuffle mode disabled');
                }
                client.queue.toggleShuffle();
            }else {
                embed
                    .setColor(0xe838cd)
                    .setTitle(`💿 Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(`🔴 There is nothing playing!`);
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
};
