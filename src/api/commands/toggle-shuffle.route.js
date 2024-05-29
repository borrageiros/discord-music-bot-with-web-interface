const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Toggle-shuffle command-route loaded");

router.get('/', async (req, res) => {
    try{
        client.queue.toggleShuffle();
        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: "Toggled" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;