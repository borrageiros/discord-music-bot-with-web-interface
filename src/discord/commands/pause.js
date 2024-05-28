const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const deleteAfterTimeout = require('../../middlewares/delete.discord.messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),
    async execute(interaction, client) {
        try {
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;

            let embed = new EmbedBuilder();
            let ephemeral = false;

            if (client.queue.isPlaying()) {
                client.queue.node.pause();
                embed
                    .setColor(0xe838cd)
                    .setTitle(`💿 Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription('⏸ Song paused!')
            }else{
                embed
                    .setColor(0xe838cd)
                    .setTitle(`💿 Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(`🔴 There is nothing playing!`);
                ephemeral = true;
            }

            const message = await interaction.reply({ embeds: [embed], ephemeral: ephemeral });
            deleteAfterTimeout(message);
        } catch (error) {
            console.error(error);
        }
    }
};
