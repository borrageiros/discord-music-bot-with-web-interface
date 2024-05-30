const router = require('express').Router();
const { client, clientEmitter } = require('../../app');


console.log("+ Delete-track command-route loaded");

router.delete('/', async (req, res) => {
    const discordGuild = req.body.discordGuild;
    const url = req.body.url;

    if (!discordGuild) {
        return res.status(400).json({ error: 'No discordGuild provided' });
    }
    
    if (!url) {
        return res.status(400).json({ error: 'No url provided' });
    }

    if (!client.queues[discordGuild]) {
        return res.status(400).json({ error: 'There is no player on the provided discordGuild' });
    }

    try{
        const currentTrack = client.queues[discordGuild].currentTrack;
        const tracks = client.queues[discordGuild].tracks.toArray();
        const fullQueue = [currentTrack, ...tracks];
        const trackToRemove = client.queues[discordGuild].tracks.toArray().filter(track => track.url === url)
        
        client.queues[discordGuild].removeTrack(trackToRemove[0]);

        clientEmitter.emit('clientChanged', client, discordGuild);
        res.status(200).json({ message: fullQueue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;