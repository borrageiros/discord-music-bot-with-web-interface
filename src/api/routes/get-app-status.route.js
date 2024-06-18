const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Get-app-status command-route loaded");

router.get('/:discordGuild', async (req, res) => {
    const discordGuild = req.params.discordGuild;

    if (!discordGuild) {
        return res.status(400).json({ error: 'No discordGuild provided' });
    }

    if (!client.queues[discordGuild]) {
        return res.status(400).json({ error: 'There is no player on the provided discordGuild' });
    }

    try{
        const guild = client.guilds.cache.get(discordGuild);
        const botMember = guild ? guild.members.cache.get(client.user.id) : null;
        const botNickname = botMember ? botMember.nickname : null;

        const currentTrack = client.queues[discordGuild].currentTrack;
        const progressBar = client.queues[discordGuild].node.createProgressBar({separator: "", indicator: "", length: 1});
        const times = progressBar && progressBar.split(" ");
        const currentDuration = progressBar && times[0];
        const currentTrackData = {
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

        const tracks = client.queues[discordGuild].tracks.toArray();
        const fullQueue = [currentTrack, ...tracks];
        const volumeString = client.queues[discordGuild].filters.volume ? client.queues[discordGuild].filters.volume.toString() : 0;
        const volumeNumber = volumeString && parseInt(volumeString.replace('%', ''), 10);
        const volume = volumeNumber && volumeNumber;
        let isPlaying
        if (client.queues[discordGuild].node.isPaused())
            isPlaying = false
        else{
            isPlaying = client.queues[discordGuild].isPlaying();
        }
        const connectedChannel = isPlaying ? client.queues[discordGuild].channel : null;
        const isShuffling = client.queues[discordGuild].isShuffling;
        const isRepeating = client.queues[discordGuild].repeatMode;
        
        clientEmitter.emit('clientChanged', client, discordGuild);
        res.status(200).json(
            {
                currentTrack: currentTrackData,
                tracks: fullQueue,
                volume,
                isPlaying,
                channel: connectedChannel ? connectedChannel.id : null,
                shuffle: isShuffling,
                repeat: isRepeating,
                botNickname: botNickname ? botNickname : null
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;