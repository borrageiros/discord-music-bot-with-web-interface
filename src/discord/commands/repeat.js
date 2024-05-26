const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Toggle the repeat loop mode'),
    async execute(interaction, client) {
        try {
            // MODES
            // 0 > Off
            // 1 > Track
            // 2 > Queue
            // 3 > Autoplay
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;

            let embed = new EmbedBuilder();

            if (client.queue.isPlaying()) {
                if (client.queue.repeatMode == QueueRepeatMode.OFF){
                    client.queue.setRepeatMode(QueueRepeatMode.TRACK)
                    embed
                        .setColor(0xe838cd)
                        .setTitle(`Click here to open "${botName}" interface`)
                        .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                        .setDescription('🟢🔁 Loop mode enabled');
                }else{
                    client.queue.setRepeatMode(QueueRepeatMode.OFF)
                    embed
                        .setColor(0xe838cd)
                        .setTitle(`Click here to open "${botName}" interface`)
                        .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                        .setDescription('🔴🔁 Loop mode disabled');
                }
            }else {
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
