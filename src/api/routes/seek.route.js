const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Seek command-route loaded");

router.post('/', async (req, res) => {
    const discordGuild = req.body.discordGuild;
    const time = req.body.time;

    if (!discordGuild) {
        return res.status(400).json({ error: 'No discordGuild provided' });
    }
    
    if (!time) {
        return res.status(400).json({ error: 'No time provided' });
    }

    if (!client.queues[discordGuild]) {
        return res.status(400).json({ error: 'There is no player on the provided discordGuild' });
    }
    
    try {
        client.queues[discordGuild].node.seek(time)
        
        clientEmitter.emit('clientChanged', client, discordGuild);
        res.status(200).json({ message: "Seeked" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;