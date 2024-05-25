const express = require('express');
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
const searcher = require('./commands/searcher.route');
const deleteTrack = require('./commands/delete-track.route');
const getCurrentTrack = require('./commands/get-current-track.route');
const moveTrack = require('./commands/move-track.route');

router.use("/", express.static('interface', { 'Content-Type': 'application/javascript' }));

router.get('/docs', (req, res) => {
  res.status(200).json({
    message: 'Api',
    endpoints: {
      play: '/api/play',
      pause: '/api/pause',
      resume: '/api/resume',
      connect: '/api/connect',
      skip: '/api/skip',
      seek: '/api/seek',
      toggleShuffle: '/api/toggle-shuffle',
      toggleRepeat: '/api/toggle-repeat',
      getAppStatus: '/api/get-app-status',
      getQueue: '/api/get-queue',
      setVolume: '/api/set-volume',
      getChannels: '/api/get-channels/:guildId',
      searcher: '/api/searcher',
      deleteTrack: '/api/delete-track',
      getCurrentTrack: '/api/get-current-track'
    }
  });
});

// command-routes registration
router.use('/api/play', play);
router.use('/api/pause', pause);
router.use('/api/resume', resume);
router.use('/api/connect', connect);
router.use('/api/skip', skip);
router.use('/api/seek', seek);
router.use('/api/toggle-shuffle', toggleShuffle);
router.use('/api/toggle-repeat', toggleRepeat);
router.use('/api/get-app-status', getAppStatus);
router.use('/api/get-channels', getChannels);
router.use('/api/set-volume', setVolume);
router.use('/api/get-queue', getQueue);
router.use('/api/searcher', searcher);
router.use('/api/delete-track', deleteTrack);
router.use('/api/get-current-track', getCurrentTrack);
router.use('/api/move-track', moveTrack);

module.exports = router;