const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Set-volume command-route loaded");

router.post('/', async (req, res) => {
    const discordGuild = req.body.discordGuild;
    const volume = req.body.volume;

    if (!discordGuild) {
        return res.status(400).json({ error: 'No discordGuild provided' });
    }
    
    if (!volume) {
        return res.status(400).json({ error: 'No volume provided' });
    }

    if (!client.queues[discordGuild]) {
        return res.status(400).json({ error: 'There is no player on the provided discordGuild' });
    }
    
    try{
        if (isNaN(volume)) {
            client.queues[discordGuild].filters.volume.setVolume(volume);
            client.defaultVolume = query;
        }else{
            client.queues[discordGuild].filters.volume.setVolume(parseInt(volume));
            client.defaultVolume = parseInt(volume);
        }
        
        clientEmitter.emit('clientChanged', client, discordGuild);
        res.status(200).json({ volume: volume });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;