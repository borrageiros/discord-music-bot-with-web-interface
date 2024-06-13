const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Resume command-route loaded");

router.get('/:discordGuild', async (req, res) => {
    const discordGuild = req.params.discordGuild;

    if (!discordGuild) {
        return res.status(400).json({ error: 'No discordGuild provided' });
    }

    if (!client.queues[discordGuild]) {
        return res.status(400).json({ error: 'There is no player on the provided discordGuild' });
    }
    
    try{
        client.queues[discordGuild].node.resume();
        clientEmitter.emit('clientChanged', client, discordGuild);
        res.status(200).json({ message: "Resumed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;