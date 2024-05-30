const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const deleteAfterTimeout = require('../../middlewares/delete.discord.messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Change current playing volume')
        .addStringOption(option =>
            option.setName('volume')
                .setDescription('The volume you want to set (0/100)')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        try {
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;
            const query = interaction.options.getString('volume');

            let embed = new EmbedBuilder();
            let ephemeral = false;

            if (client.queues[interaction.guildId].isPlaying()) {
                if (isNaN(query)) {
                    client.queues[interaction.guildId].filters.volume.setVolume(query);
                    client.defaultVolume = query;
                }else{
                    client.queues[interaction.guildId].filters.volume.setVolume(parseInt(query));
                    client.defaultVolume = parseInt(query);
                }
                embed
                    .setColor(0xe838cd)
                    .setTitle(`💿 Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(`🔊 Volume set to: ${query}`);
            }else {
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
