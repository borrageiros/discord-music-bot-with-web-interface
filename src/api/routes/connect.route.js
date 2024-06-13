const router = require('express').Router();
const { client, clientEmitter } = require('../../app');
const { GuildQueue } = require('discord-player');

console.log("+ Connect command-route loaded");

router.post('/', async (req, res) => {
    const discordGuild = req.body.discordGuild;
    const voiceChannelId = req.body.voiceChannelId;
    
    if (!discordGuild) {
        return res.status(400).json({ error: 'No discordGuild provided' });
    }

    if (!voiceChannelId) {
        return res.status(400).json({ error: 'No voiceChannelId provided' });
    }

    if (!client.queues[discordGuild]) {
        client.queues[discordGuild] = new GuildQueue(client.player, {});;
    }
    
    try {
        await client.queues[discordGuild].connect(voiceChannelId);
        clientEmitter.emit('clientChanged', client, discordGuild);
        res.status(200).json({ message: "Connected" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;