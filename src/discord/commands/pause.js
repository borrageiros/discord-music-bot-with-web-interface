const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),
    async execute(interaction, client) {
        try {
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;

            client.queue.node.pause();

            const embed = new EmbedBuilder()
                .setColor(0xe838cd)
                .setTitle(`Click here to open "${botName}" interface`)
                .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                .setDescription('Song paused!')
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
};
