<script>
    import { onMount } from 'svelte';
    import YoutubeSvg from '/icons/youtube.svg'
    import SongCard from './SongCard.svelte';
    import { youtubeSearcher } from '../api'

    let searchQuery = '';
    let results = [];

    onMount(async () => {
        const musicGenres = ["rock", "pop", "jazz", "classical", "hip hop", "techno", "country", "blues", "reggae", "folk"];
        const randomGenre = musicGenres[Math.floor(Math.random() * musicGenres.length)];
        const response = await youtubeSearcher(randomGenre);
        results = response.message ? [...response.message] : [];
    });

    async function searchYouTube() {
        if (searchQuery.trim() !== '') {
            const response = await youtubeSearcher(searchQuery);
            results = [...response.message];
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            searchYouTube();
        }
    }

    function removeSong(trackId) {
        results = results.filter(track => track.id !== trackId);
    }
</script>

<div class="youtube-searcher-container">
    <div class="youtube-searcher">
        <img class="youtube-logo" src={YoutubeSvg} alt="">
        <input 
            class="youtube-searcher-input" 
            type="text" 
            bind:value={searchQuery}
            on:keydown={handleKeyDown}
            placeholder="YouTube...">
    </div>
    <div class="youtube-searcher-results">
        {#key results}
        {#each results as track}
            <SongCard
                isQueue={false}
                id={track.id}
                title={track.title}
                channelTitle={track.channelTitle}
                url={"https://www.youtube.com/watch?v="+track.id}
                img={track.thumbnail.thumbnails[0].url}
                on:remove={() => removeSong(track.id)}
            />
        {/each}
        {/key}
    </div>
</div>

<style>
    .youtube-searcher-container{
        margin: 0.5vh;
        height: 100%;
        background-color: black;
        overflow: scroll;
        overflow-x: hidden;
    }
    .youtube-searcher{
        min-height: 9vh;
        border-bottom: solid 2px #242424;
        display: flex;
        align-items: center;
    }
    .youtube-logo{
        margin: 2vh;
        height: 5vh;
    }
    .youtube-searcher-input{
        width: 80%;
        margin-right: 1vh;
        height: 3vh;
        padding: 2vh;
    }
</style>