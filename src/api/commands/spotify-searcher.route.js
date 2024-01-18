const router = require('express').Router();
const { client, clientEmitter } = require('../../app');
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();

console.log("+ Spotify-searcher command-route loaded");

router.post('/', async (req, res) => {
    const query = req.body.query;
    
    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }
    
    try{
        let spotifyCredentialsResponse = await fetch("https://open.spotify.com/get_access_token", {
            method: 'GET'
        });
        let spotifyCredentials = await spotifyCredentialsResponse.json();
        const clientID = spotifyCredentials.clientId;
        const secretKey = spotifyCredentials.accessToken;
        let tracks = [ ];
        spotifyApi.setAccessToken(secretKey);
        spotifyApi.searchTracks(query)
            .then(function(data) {
                tracks = data.body.tracks.items.map(track => {
                    return {
                        id: track.id,
                        title: track.name,
                        channelTitle: track.artists[0].name,
                        url: track.external_urls.spotify,
                        img: track.album.images.reduce((prev, current) => {
                            return (prev.height > current.height) ? prev.url : current.url;
                        })
                    };
                });
                clientEmitter.emit('clientChanged', client);
                res.status(200).json({ message: tracks });
            }, function(err) {
            console.error(err);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
});

module.exports = router;