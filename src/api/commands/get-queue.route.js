const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Get-queue command-route loaded");

router.get('/', async (req, res) => {
    try{
        const currentTrack = client.queue.currentTrack;
        const tracks = client.queue.tracks.toArray();
        const fullQueue = [currentTrack, ...tracks];
        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: fullQueue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;