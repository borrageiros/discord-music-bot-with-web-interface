const router = require('express').Router();
const { QueryType, Track } = require('discord-player');
const { client, clientEmitter } = require('../../app');
const { GuildQueue } = require('discord-player');

console.log("+ Play command-route loaded");

router.post('/', async (req, res) => {
    const discordGuild = req.body.discordGuild;
    const url = req.body.url;
    const voiceChannelId = req.body.voiceChannelId;
    
    if (!discordGuild) {
        return res.status(400).json({ error: 'No discordGuild provided' });
    }

    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }
    
    if (!voiceChannelId) {
        return res.status(400).json({ error: 'No voiceChannelId provided' });
    }

    if (!client.queues[discordGuild]) {
        client.queues[discordGuild] = new GuildQueue(client.player, {});
    }
    
    try {
        if (!client.queues[discordGuild].connection) await client.queues[discordGuild].connect(voiceChannelId);
    } catch {
        return res.status(500).json({ error: 'Something went wrong: I cant contect to the voice channel... try again' });
    }
    
    try {
        const searcher = await client.player.search(url, {searchEngine: QueryType.AUTO});

        if ( searcher.playlist ) {
            searcher.tracks.forEach(function(song) {
                const track = new Track(client.player, song);
                client.queues[discordGuild].addTrack( track );
            });
        } else {
            const track = new Track(client.player, searcher.tracks[0]);
            client.queues[discordGuild].addTrack( track );
        }

        if (!client.queues[discordGuild].isPlaying()) await client.queues[discordGuild].node.play();
        client.queues[discordGuild].filters.volume.setVolume(client.defaultVolume);
        
        clientEmitter.emit('clientChanged', client, discordGuild);
        res.status(200).json({ message: searcher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;