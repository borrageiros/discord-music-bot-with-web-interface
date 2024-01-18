const router = require('express').Router();
const { client, clientEmitter } = require('../../app');

console.log("+ Get-app-status command-route loaded");

router.get('/', async (req, res) => {
    try{

        const currentTrack = client.queue.currentTrack;
        const progressBar = client.queue.node.createProgressBar({separator: "", indicator: "", length: 1});
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

        const tracks = client.queue.tracks.toArray();
        const fullQueue = [currentTrack, ...tracks];
        const volumeString = client.queue.filters.volume ? client.queue.filters.volume.toString() : 0;
        const volumeNumber = volumeString && parseInt(volumeString.replace('%', ''), 10);
        const volume = volumeNumber && volumeNumber;
        let isPlaying
        if (client.queue.node.isPaused())
            isPlaying = false
        else{
            isPlaying = client.queue.isPlaying();
        }
        const connectedChannel = isPlaying ? client.queue.channel : null;
        const isShuffling = client.queue.isShuffling;
        const isRepeating = client.queue.repeatMode;
        
        clientEmitter.emit('clientChanged', client);
        res.status(200).json(
            {
                currentTrack: currentTrackData,
                tracks: fullQueue,
                volume,
                isPlaying,
                channel: connectedChannel ? connectedChannel.id : null,
                shuffle: isShuffling,
                repeat: isRepeating
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;