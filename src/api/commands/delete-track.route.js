const router = require('express').Router();
const { client, clientEmitter } = require('../../app');
const { Track } = require('discord-player');


console.log("+ Delete-track command-route loaded");

router.delete('/', async (req, res) => {
    const url = req.body.url;
    
    if (!url) {
        return res.status(400).json({ error: 'No url provided' });
    }

    try{
        const currentTrack = client.queue.currentTrack;
        const tracks = client.queue.tracks.toArray();
        const fullQueue = [currentTrack, ...tracks];
        const trackToRemove = client.queue.tracks.toArray().filter(track => track.url === url)
        
        client.queue.removeTrack(trackToRemove[0]);

        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: fullQueue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;