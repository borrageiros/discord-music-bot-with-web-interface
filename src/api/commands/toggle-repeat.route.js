const router = require('express').Router();
const { client, clientEmitter } = require('../../app');
const { QueueRepeatMode } = require('discord-player');

console.log("+ Toggle-repeat command-route loaded");

router.get('/', async (req, res) => {
    try{
        // MODES
        // 0 > Off
        // 1 > Track
        // 2 > Queue
        // 3 > Autoplay
        if (client.queue.repeatMode == QueueRepeatMode.OFF){
            client.queue.setRepeatMode(QueueRepeatMode.TRACK)
        }else{
            client.queue.setRepeatMode(QueueRepeatMode.OFF)
        }
        
        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: client.queue.repeatMode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;