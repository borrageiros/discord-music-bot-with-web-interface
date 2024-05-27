const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType, Track } = require('discord-player');

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

            if (!voiceChannel) {
                return interaction.reply('You need to be in a voice channel to use this command!');
            }

            try{
                if (!client.queue.connection) await client.queue.connect(voiceChannel.id);
            } catch {
                return interaction.reply('Something went wrong: I cant connect to the voice channel... try again');
            }

            // Reproduce
            const track = new Track(client.player, results.tracks[0]);
            client.queue.addTrack( track );
            
            if (!client.queue.isPlaying()) await client.queue.node.play();
            client.queue.filters.volume.setVolume(client.defaultVolume);

            // Reply
            const image = track.thumbnail;
            const title = track.title;

            const embed = new EmbedBuilder()
                .setColor(0xe838cd)
                .setTitle(`💿 Click here to open "${botName}" interface`)
                .setURL(process.env.DOMAIN + "/?guild=" + interaction.guildId + "&channel=" + interaction.member.voice.channelId + "&track=https://www.youtube.com/watch?v=" + results.tracks[0].id)
                .setDescription(`⏯ **Song added!**\n${title}`)
                .setImage(image);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
};
