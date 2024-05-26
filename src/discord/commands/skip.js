const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current playing song'),
    async execute(interaction, client) {
        try {
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;


            let embed = new EmbedBuilder();

            if (client.queue.isPlaying()) {
                client.queue.node.skip([]);
                embed
                    .setColor(0xe838cd)
                    .setTitle(`Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription('⏭ Song skipped!');
            }else{
                embed
                    .setColor(0xe838cd)
                    .setTitle(`Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(`🔴 There is nothing playing!`);
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
};
