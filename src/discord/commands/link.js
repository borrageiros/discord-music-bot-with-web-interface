const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Send to the channel a link to open the web reproducer'),
    async execute(interaction, client) {
        try {
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;

            const embed = new EmbedBuilder()
                .setColor(0xe838cd)
                .setTitle(`💿 Click here to open "${botName}" interface`)
                .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                .setImage("https://raw.githubusercontent.com/borrageiros/discord-music-bot-with-web-interface/main/readme/screenshot.jpg");
            await interaction.deferReply();
            await interaction.deleteReply();
            await interaction.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
};
