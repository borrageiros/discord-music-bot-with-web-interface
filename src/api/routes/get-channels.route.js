const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Get-channels command-route loaded");

router.get('/:guildId', async (req, res) => {
    const guildId = req.params.guildId;
    
    if (!guildId) {
        return res.status(400).json({ error: 'No guild ID provided' });
    }
    
    try {
        const guild = await client.guilds.fetch(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }
        
        const channels = await guild.channels.fetch();
        const voiceChannelList = channels.filter(channel => channel.type === 2) // Only voice channels (type 2)
        .map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type
        }));
        
        clientEmitter.emit('clientChanged', client, guildId );
        res.status(200).json({ channels: voiceChannelList });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;