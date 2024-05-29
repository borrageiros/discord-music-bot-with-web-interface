const router = require('express').Router();
const { client, clientEmitter } = require('../../app');
const { QueryType } = require('discord-player');


console.log("+ Searcher command-route loaded");

// SEARCH ENGINES
// autoSearch
// youtube
// spotifySearch
// soundcloudSearch
// appleMusicSearch

router.post('/', async (req, res) => {
    const query = req.body.query;
    const engine = req.body.engine;
    
    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    const allowedEngines = ['youtube', 'spotifySearch', 'soundcloudSearch', 'appleMusicSearch'];

    if (!engine || !allowedEngines.includes(engine)) {
        return res.status(400).json({ error: 'Engine is not valid: [youtube, spotifySearch, soundcloudSearch, appleMusicSearch]' });
    }

    try{
        const results = await client.player.search(query, { searchEngine: engine ? engine : "" });

        clientEmitter.emit('clientChanged', client);
        res.status(200).json({ message: results.tracks ? results.tracks : [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;