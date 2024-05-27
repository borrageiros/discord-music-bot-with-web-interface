const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Set-volume command-route loaded");

router.post('/', async (req, res) => {
    const volume = req.body.volume;
    
    if (!volume) {
        return res.status(400).json({ error: 'No volume provided' });
    }
    
    try{
        // Convert string to number if necessary
        if (isNaN(volume)) {
            client.queue.filters.volume.setVolume(volume);
            client.defaultVolume = query;
        }else{
            client.queue.filters.volume.setVolume(parseInt(volume));
            client.defaultVolume = parseInt(volume);
        }
        
        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ volume: volume });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;