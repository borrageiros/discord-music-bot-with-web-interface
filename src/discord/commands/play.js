const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType, Track } = require('discord-player');
const deleteAfterTimeout = require('../../middlewares/delete.discord.messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music by the given song name or song link')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('URL or track name to play')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        try{
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const botName = botMember ? botMember.displayName : client.user.username;
            const query = interaction.options.getString('song');
            const results = await client.player.search(query, { searchEngine: QueryType.AUTO });
            const voiceChannel = interaction.member.voice.channel;

            let embed = new EmbedBuilder();
            let ephemeral = false;

            // Reproduce
            if (!client.queue.connection) await client.queue.connect(voiceChannel.id);
            const track = new Track(client.player, results.tracks[0]);
            client.queue.addTrack( track );
            
            if (!client.queue.isPlaying()) await client.queue.node.play();
            client.queue.filters.volume.setVolume(client.defaultVolume);

            // Reply
            const image = track.thumbnail;
            const title = track.title;

            if (voiceChannel) {
                try{
                    embed = new EmbedBuilder()
                        .setColor(0xe838cd)
                        .setTitle(`💿 Click here to open "${botName}" interface`)
                        .setURL(process.env.DOMAIN + `/?guild=${interaction.guildId}`)
                        .setDescription(`⏯ **Song added!**\n${title}`)
                        .setImage(image);
                } catch {
                    embed
                        .setColor(0xe838cd)
                        .setTitle(`💿 Click here to open "${botName}" interface`)
                        .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                        .setDescription(`🔴 Something went wrong: I cant connect to the voice channel... try again`);
                    ephemeral = true;
                }
            }else {
                embed
                    .setColor(0xe838cd)
                    .setTitle(`💿 Click here to open "${botName}" interface`)
                    .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId)
                    .setDescription(`🔴 You need to be in a voice channel to use this command!`);
                ephemeral = true;
            }
            const message = await interaction.reply({ embeds: [embed], ephemeral: ephemeral });
            deleteAfterTimeout(message);
        } catch (error) {
            console.error(error);
        }
    }
};
