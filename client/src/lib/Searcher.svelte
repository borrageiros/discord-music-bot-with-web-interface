<script>
    import { onMount } from 'svelte';
    import { searcher, playSong } from '../api';
    import SongCard from './SongCard.svelte';
    import YoutubeSvg from '/icons/youtube.svg';
    import SpotifySvg from '/icons/spotify.svg';
    import SoundCloudSvg from '/icons/soundcloud.svg';
    import AppleMusicSvg from '/icons/applemusic.svg';
    import MenuButton from './ToggleMenuButton.svelte';
    import Loader from './LoaderSvg.svelte';
    import ChannelChooser from './ChannelChooser.svelte';
    import { showNotification } from './NotificationStore';

    export let appStatus;
    export let phoneQueueVisible;

    let searchQuery = '';
    let results = [];
    let selectedEngine = 'youtube';
    let loading = false;

    onMount(async () => {
        randomSearch();
    });

    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    async function handleSuccessfullyAddTrack() {
        searchQuery = '';
    }

    async function search() {
        loading = true;
        if (searchQuery.trim() !== '') {
            const response = await searcher( searchQuery, selectedEngine );
            results = [...response.message];
        }
        loading = false;
    }

    async function sendLink() {
        loading = true;
        try {
            await playSong(searchQuery, appStatus.channel && appStatus.channel);
        } catch (error) {
            showNotification("Not valid link", "error");
            searchQuery = '';
            loading = false;
        }
        searchQuery = '';
        loading = false;
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
            if (validURL(searchQuery)) {
                sendLink();
            } else {
                search();
            }
        }
    }

    function removeSong(trackId) {
        results = results.filter(track => track.id !== trackId);
    }

    function selectImage(imageName) {
        selectedEngine = imageName;
        if ( searchQuery.length && !validURL(searchQuery)){
            search();
        }else {
            randomSearch();
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
            on:keydown={() => selectImage('youtube')} 
        >

        <img 
            class="logo {selectedEngine === 'spotifySearch' ? 'selected-logo' : ''}" 
            src={SpotifySvg} 
            alt="spotifySearch" 
            on:click={() => selectImage('spotifySearch')} 
            on:keydown={() => selectImage('spotifySearch')} 
        >

        <img 
            class="logo {selectedEngine === 'soundcloudSearch' ? 'selected-logo' : ''}" 
            src={SoundCloudSvg} 
            alt="soundcloudSearch" 
            on:click={() => selectImage('soundcloudSearch')} 
            on:keydown={() => selectImage('soundcloudSearch')}
        >

        <img 
            class="logo {selectedEngine === 'appleMusicSearch' ? 'selected-logo' : ''}" 
            src={AppleMusicSvg} 
            alt="appleMusicSearch" 
            on:click={() => selectImage('appleMusicSearch')} 
            on:keydown={() => selectImage('appleMusicSearch')} 
        >

        <MenuButton bind:phoneQueueVisible={phoneQueueVisible} />

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
        {#if !appStatus.tracks[0]}
            <ChannelChooser {appStatus} />
        {/if}
    </div>
    <div class="searcher-results" class:loading={results.length === 0 || loading}>
        {#if results.length === 0 || loading}
            <div class="loader" >
                <Loader />
            </div>
        {:else}
            {#key results}
                {#each results as track, index}
                    <SongCard
                        isQueue={ false }
                        isLive={ track.durationMS === 0 && selectedEngine != "appleMusicSearch" ? true : false }
                        duration={ track.duration && selectedEngine != "appleMusicSearch" ? track.duration : "" }
                        id={ track.id }
                        title={ track.title }
                        channelTitle={ track.author }
                        url={ track.url }
                        img={ track.thumbnail }
                        arrayPosition={index}
                        isLastItem={ index === results.length - 1 }
                        on:remove={() => removeSong(track.id)}
                        handleSuccessfullyAddTrack={handleSuccessfullyAddTrack}
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
        border-radius: 25px;
        margin: 1vh;
        -ms-overflow-style: none;  /* Internet Explorer, Edge */
        scrollbar-width: none; /* Internet Explorer, Edge */
    }
    .searcher-container::-webkit-scrollbar {
        display: none;  /* Chrome, Safari, Opera */
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
    .searcher-results{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .searcher-results.loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80%;
    }
    .loader {
        height: 10%;
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
        color: white;
        width: 70%;
        margin-right: 1vh;
        height: 3vh;
        padding: 2vh;
        border-radius: 25px;
        background-color: #242424;
    }
    @media (max-width: 1024px) {        
        .searcher {
            min-height: 9vh;
            flex-wrap: wrap;
            justify-content: space-around;
        }

        .searcher-input {
            width: 90%;
            margin-bottom: 1vh;
        }
    }
</style>