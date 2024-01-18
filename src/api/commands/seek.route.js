const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Seek command-route loaded");

router.post('/', async (req, res) => {
    const time = req.body.time;
    
    if (!time) {
        return res.status(400).json({ error: 'No time provided' });
    }
    
    try {
        client.queue.node.seek(time)
        
        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: "Seeked" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;