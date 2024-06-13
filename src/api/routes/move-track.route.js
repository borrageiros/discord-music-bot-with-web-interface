const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Get track position command-route loaded");

// It not works with the current track

router.post('/', async (req, res) => {
    const discordGuild = req.body.discordGuild;
    const from = req.body.from;
    const to = req.body.to;

    if (!discordGuild) {
        return res.status(400).json({ error: 'No discordGuild provided' });
    }

    if (!client.queues[discordGuild]) {
        return res.status(400).json({ error: 'There is no player on the provided discordGuild' });
    }

    if ( !client.queues[discordGuild] || !client.queues[discordGuild].tracks){
        return res.status(400).json({ error: 'No queue enabled' });
    }

    if (from < 0){
        return res.status(400).json({ error: 'No negative numbers admitted' });
    }

    try{
        const trackFrom = client.queues[discordGuild].tracks.data[ from ];

        const queuePosition = client.queues[discordGuild].node.getTrackPosition( trackFrom )
        await client.queues[discordGuild].node.move( queuePosition, to );

        clientEmitter.emit('clientChanged', client, discordGuild);
        res.status(200).json({ message: "Moved" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;