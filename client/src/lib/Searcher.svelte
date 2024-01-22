<script>
    import { onMount } from 'svelte';
    import { searcher } from '../api';
    import SongCard from './SongCard.svelte';
    import YoutubeSvg from '/icons/youtube.svg';
    import SpotifySvg from '/icons/spotify.svg';
    import SoundCloudSvg from '/icons/soundcloud.svg';
    import AppleMusicSvg from '/icons/applemusic.svg';
    import LoaderSvg from '/icons/loader.svg'

    let searchQuery = '';
    let results = [];
    let selectedEngine = 'youtube';

    onMount(async () => {
        randomSearch()
    });

    async function search() {
        if (searchQuery.trim() !== '') {
            const response = await searcher( searchQuery, selectedEngine );
            results = [...response.message];
        }
    }

    async function randomSearch() {
        results = [];
        const musicGenres = ["rock", "pop", "jazz", "classical", "hip hop", "techno", "country", "blues", "reggae", "folk"];
        const randomGenre = musicGenres[ Math.floor( Math.random() * musicGenres.length ) ];
        const response = await searcher(randomGenre, selectedEngine);
        results = response.message ? [...response.message] : [];
    }

    function handleKeyDownSearch(event) {
        if (event.key === 'Enter') {
            search();
        }
    }

    function removeSong(trackId) {
        results = results.filter(track => track.id !== trackId);
    }

    function selectImage(imageName) {
        selectedEngine = imageName;
        randomSearch();
    }

    function handleKeyDownSelectEngine(event, imageName) {
        if (event.key === 'Enter') {
            selectImage(imageName);
        }
    }
</script>

<div class="searcher-container">
    <div class="searcher sticky-searcher">
        <img 
            class="logo {selectedEngine === 'youtube' ? 'selected-logo' : ''}" 
            src={YoutubeSvg} 
            alt="youtube" 
            on:click={() => selectImage('youtube')} 
            on:keydown={(event) => handleKeyDownSelectEngine(event, 'youtube')}
        >

        <img 
            class="logo {selectedEngine === 'spotifySearch' ? 'selected-logo' : ''}" 
            src={SpotifySvg} 
            alt="spotifySearch" 
            on:click={() => selectImage('spotifySearch')} 
            on:keydown={(event) => handleKeyDownSelectEngine(event, 'spotifySearch')}
        >

        <img 
            class="logo {selectedEngine === 'soundcloudSearch' ? 'selected-logo' : ''}" 
            src={SoundCloudSvg} 
            alt="soundcloudSearch" 
            on:click={() => selectImage('soundcloudSearch')} 
            on:keydown={(event) => handleKeyDownSelectEngine(event, 'soundcloudSearch')}
        >

        <img 
            class="logo {selectedEngine === 'appleMusicSearch' ? 'selected-logo' : ''}" 
            src={AppleMusicSvg} 
            alt="appleMusicSearch" 
            on:click={() => selectImage('appleMusicSearch')} 
            on:keydown={(event) => handleKeyDownSelectEngine(event, 'appleMusicSearch')}
        >

        <input 
            class="searcher-input" 
            type="text" 
            bind:value={searchQuery}
            on:keydown={handleKeyDownSearch}
            placeholder={
            selectedEngine === 'youtube' ? 'YouTube...' :
            selectedEngine === 'spotifySearch' ? 'Spotify...' :
            selectedEngine === 'soundcloudSearch' ? 'SoundCloud...' :
            selectedEngine === 'appleMusicSearch' ? 'AppleMusic...' :
            'Search...'
            }
        >
    </div>
    <div class="searcher-results" class:loading={results.length === 0}>
        {#if results.length === 0}
            <img src={LoaderSvg} alt="Loading..." class="loader" />
        {:else}
            {#key results}
                {#each results as track}
                    <SongCard
                        isQueue={ false }
                        isLive={ track.durationMS === 0 && selectedEngine != "appleMusicSearch" ? true : false }
                        duration={ track.duration && selectedEngine != "appleMusicSearch" ? track.duration : "" }
                        id={ track.id }
                        title={ track.title }
                        channelTitle={ track.author }
                        url={ track.url }
                        img={ track.thumbnail }
                        on:remove={() => removeSong(track.id)}
                    />
                {/each}
            {/key}
        {/if}
    </div>    
</div>

<style>
    .searcher-container{
        height: 100%;
        background-color: black;
        overflow: scroll;
        overflow-x: hidden;
    }
    .sticky-searcher {
        position: sticky;
        top: 0;
        z-index: 999;
        background-color: black;
        border-bottom: solid 2px #242424;
        display: flex;
        align-items: center;
    }
    .searcher-results.loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90vh;
    }
    .searcher{
        min-height: 9vh;
        background-color: black;
        border-bottom: solid 2px #242424;
        display: flex;
        align-items: center;
    }
    .logo{
        margin: 2vh;
        height: 5vh;
        cursor: pointer;
    }
    .selected-logo {
        border: 3px solid yellowgreen;
        border-radius: 25px;
        box-shadow: 0 0 10px white;
        padding: 5px;
    }
    .searcher-input{
        width: 70%;
        margin-right: 1vh;
        height: 3vh;
        padding: 2vh;
    }
    .loader {
        display: block;
        margin: auto;
        height: 10vh;
    }
</style>