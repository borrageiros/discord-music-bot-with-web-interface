const router = require('express').Router();
const { QueryType, Track } = require('discord-player');
const { client, clientEmitter } = require('../../app');

console.log("+ Play command-route loaded");

router.post('/', async (req, res) => {
    const url = req.body.url;
    const voiceChannelId = req.body.voiceChannelId;
    
    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }
    
    if (!voiceChannelId) {
        return res.status(400).json({ error: 'No voiceChannelId provided' });
    }
    
    try {
        if (!client.queue.connection) await client.queue.connect(voiceChannelId);
    } catch {
        console.log("Something went wrong: I can´t contect to the voice channel... try again")
        return
    }
    
    try {
        const searcher = await client.player.search(url, {searchEngine: QueryType.AUTO});
        const track = new Track(client.player, searcher.tracks[0]);
        
        client.queue.addTrack( track );
        
        if (!client.queue.isPlaying()) await client.queue.node.play();
        
        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: track });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;