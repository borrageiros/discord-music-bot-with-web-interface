<script>
    import { onMount } from 'svelte';
    import SpotifySvg from '/icons/spotify.svg'
    import SongCard from './SongCard.svelte';
    import { spotifySearcher } from '../api'

    let searchQuery = '';
    let results = [];

    onMount(async () => {
        const musicGenres = ["rock", "pop", "jazz", "classical", "hip hop", "techno", "country", "blues", "reggae", "folk"];
        const randomGenre = musicGenres[Math.floor(Math.random() * musicGenres.length)];
        const response = await spotifySearcher(randomGenre);
        results = response.message ? [...response.message] : [];
    });

    async function searchSpotify() {
        if (searchQuery.trim() !== '') {
            const response = await spotifySearcher(searchQuery);
            results = [...response.message];
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            searchSpotify();
        }
    }

    function removeSong(trackId) {
        results = results.filter(track => track.id !== trackId);
    }
</script>

<div class="spotify-searcher-container">
    <div class="spotify-searcher">
        <img class="spotify-logo" src={SpotifySvg} alt="">
        <input 
            class="spotify-searcher-input" 
            type="text" 
            bind:value={searchQuery}
            on:keydown={handleKeyDown}
            placeholder="Spotify...">
    </div>
    <div class="spotify-searcher-results">
        {#key results}
        {#each results as track}
            <SongCard
                isQueue={false}
                id={track.id}
                title={track.title}
                channelTitle={track.channelTitle}
                url={track.url}
                img={track.img}
                on:remove={() => removeSong(track.id)}
            />
        {/each}
        {/key}
    </div>
</div>

<style>
    .spotify-searcher-container{
        margin: 0.5vh;
        height: 100%;
        background-color: black;
        overflow: scroll;
        overflow-x: hidden;
    }
    .spotify-searcher{
        min-height: 9vh;
        border-bottom: solid 2px #242424;
        display: flex;
        align-items: center;
    }
    .spotify-logo{
        margin: 2vh;
        height: 5vh;
    }
    .spotify-searcher-input{
        width: 80%;
        margin-right: 1vh;
        height: 3vh;
        padding: 2vh;
    }
</style>