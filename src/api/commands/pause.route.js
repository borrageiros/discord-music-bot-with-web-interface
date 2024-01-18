const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Pause command-route loaded");

router.get('/', async (req, res) => {
    try{
        client.queue.node.pause();
        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: "Paused" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;