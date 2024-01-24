<script>
    import SongCard from './SongCard.svelte';
    import { onMount } from 'svelte';
    import PlaySvg from '/icons/play.svg'
    import { playSong } from '../api';

    export let appStatus;
    let trackParam;
    let channelParam;

    onMount(async () => {
        try {
            const queryParams = new URLSearchParams(window.location.search);
            trackParam = queryParams.get('track');
            channelParam = queryParams.get('channel');
            if ( trackParam && channelParam ){
                await playSong(trackParam, channelParam )
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.location.href = newUrl;
            }
        } catch (error) {
            console.log(error)
        }
    })

    let searchQuery = '';
    
    async function sendLink() {
        await playSong(searchQuery, appStatus.channel && appStatus.channel );
    }
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            sendLink();
        }
    }
</script>

<div class="queue-container">
    <div class="queue sticky-searcher">
        <img class="queue-logo" src={PlaySvg} alt="">
        <input 
            class="queue-input" 
            type="text" 
            bind:value={searchQuery}
            on:keydown={handleKeyDown}
            placeholder="Add link to queue..."
        >
    </div>
    <div class="queue-results">
        {#if appStatus && appStatus.tracks[0] && appStatus.tracks[0].id}
            {#each appStatus.tracks as track, index}
                <SongCard
                    id={track.id}
                    title={track.title}
                    channelTitle={track.author}
                    url={track.url}
                    img={track.thumbnail}
                    isQueue={true}
                    isLive={ track.durationMS === 0 && !track.url.includes("apple") ? true : false }
                    duration={ track.duration && !track.url.includes("apple") ? track.duration : "" }
                    arrayPosition={index}
                    isLastItem={ index === appStatus.tracks.length - 1 }
                />
            {/each}
        {/if}    
    </div>
</div>

<style>
    .queue-container{
        height: 100%;
        background-color: black;
        overflow: scroll;
        overflow-x: hidden;
    }
    .queue{
        min-height: 9vh;
        border-bottom: solid 2px #242424;
        display: flex;
        align-items: center;
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
    .queue-logo{
        margin: 2vh;
        height: 5vh;
    }
    .queue-input{
        width: 80%;
        margin-right: 1vh;
        height: 3vh;
        padding: 2vh;
    }
</style>