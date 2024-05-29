const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Get track position command-route loaded");

// It not works with the current track

router.post('/', async (req, res) => {
    let from = req.body.from;
    const to = req.body.to;

    if ( !client.queue || !client.queue.tracks){
        return res.status(400).json({ error: 'No queue enabled' });
    }

    if (from < 0){
        return res.status(400).json({ error: 'No negative numbers admitted' });
    }

    try{
        const trackFrom = client.queue.tracks.data[ from ];

        const queuePosition = client.queue.node.getTrackPosition( trackFrom )
        await client.queue.node.move( queuePosition, to );

        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;