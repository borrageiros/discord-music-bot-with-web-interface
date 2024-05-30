const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Get-queue command-route loaded");

router.get('/:discordGuild', async (req, res) => {
    const discordGuild = req.params.discordGuild;

    if (!discordGuild) {
        return res.status(400).json({ error: 'No discordGuild provided' });
    }

    if (!client.queues[discordGuild]) {
        return res.status(400).json({ error: 'There is no player on the provided discordGuild' });
    }

    try{
        const currentTrack = client.queues[discordGuild].currentTrack;

        const progressBar = client.queues[discordGuild].node.createProgressBar({separator: "", indicator: "", length: 1});
        const times = progressBar && progressBar.split(" ");
        const currentDuration = progressBar && times[0];

        const data = {
            id: currentTrack && currentTrack.id,
            title: currentTrack && currentTrack.title,
            description: currentTrack && currentTrack.duration,
            author: currentTrack && currentTrack.author,
            url: currentTrack && currentTrack.url,
            thumbnail: currentTrack && currentTrack.thumbnail,
            duration: currentTrack && currentTrack.duration,
            currentDuration: currentDuration, // ----
            durationMS: currentTrack && currentTrack.durationMS,
            views: currentTrack && currentTrack.views,
            requestedBy: currentTrack && currentTrack.requestedBy,
            playlist: currentTrack && currentTrack.playlist
        }

        clientEmitter.emit('clientChanged', client, discordGuild);
        res.status(200).json({ message: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;