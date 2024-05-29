const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Connect command-route loaded");

router.post('/', async (req, res) => {
    const voiceChannelId = req.body.voiceChannelId;
    
    if (!voiceChannelId) {
        return res.status(400).json({ error: 'No voiceChannelId provided' });
    }
    
    try {
        await client.queue.connect(voiceChannelId);
        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: "Connected" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;