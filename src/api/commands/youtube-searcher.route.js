const router = require('express').Router();
const { client, clientEmitter } = require('../../app');
const youtubesearchapi = require("youtube-search-api");

console.log("+ Youtube-searcher command-route loaded");

router.post('/', async (req, res) => {
    const query = req.body.query;
    
    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }
    
    try{
        const videos = await youtubesearchapi.GetListByKeyword(query)
        const filteredVideos = videos.items.filter(item => item.type === 'video');
        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: filteredVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;