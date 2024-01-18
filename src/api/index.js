const router = require('express').Router();
const play = require('./commands/play.route');
const pause = require('./commands/pause.route');
const resume = require('./commands/resume.route');
const connect = require('./commands/connect.route');
const skip = require('./commands/skip.route');
const seek = require('./commands/seek.route');
const toggleShuffle = require('./commands/toggle-shuffle.route');
const toggleRepeat = require('./commands/toggle-repeat.route');
const getAppStatus = require('./commands/get-app-status.route');
const getQueue = require('./commands/get-queue.route');
const setVolume = require('./commands/set-volume.route');
const getChannels = require('./commands/get-channels.route');
const youtubeSearcher = require('./commands/youtube-searcher.route');
const spotifySearcher = require('./commands/spotify-searcher.route');
const deleteTrack = require('./commands/delete-track.route');
const getCurrentTrack = require('./commands/get-current-track.route');

router.get('/', (req, res) => {
  res.status(200).json({
    message: '🍕 Api route 🍕',
  });
});

// command-routes registration
router.use('/play', play);
router.use('/pause', pause);
router.use('/resume', resume);
router.use('/connect', connect);
router.use('/skip', skip);
router.use('/seek', seek);
router.use('/toggle-shuffle', toggleShuffle);
router.use('/toggle-repeat', toggleRepeat);
router.use('/get-app-status', getAppStatus);
router.use('/get-channels', getChannels);
router.use('/set-volume', setVolume);
router.use('/get-queue', getQueue);
router.use('/youtube-searcher', youtubeSearcher);
router.use('/spotify-searcher', spotifySearcher);
router.use('/delete-track', deleteTrack);
router.use('/get-current-track', getCurrentTrack);

module.exports = router;