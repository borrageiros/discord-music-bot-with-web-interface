<script>
    export let appStatus;
    let trackParam;
    let channelParam;
    import { onMount } from 'svelte';
    import PlaySvg from '/icons/play.svg'
    import { playSong } from '../api';
    import SongCard from './SongCard.svelte';

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
    <div class="queue">
        <img class="queue-logo" src={PlaySvg} alt="">
        <input 
            class="queue-input" 
            type="text" 
            bind:value={searchQuery}
            on:keydown={handleKeyDown}
            placeholder="Add link to queue...">
    </div>
    <div class="queue-results">
        {#if appStatus && appStatus.tracks[0] && appStatus.tracks[0].id}
            {#each appStatus.tracks as track}
                <SongCard
                    isQueue={true}
                    isLive={ track.isLive ? track.isLive : false }
                    duration={ !track.isLive && track.length && track.length.simpleText }
                    id={track.id}
                    title={track.title}
                    channelTitle={track.author}
                    url={track.url}
                    img={track.thumbnail}
                />
            {/each}
        {/if}    
    </div>
</div>

<style>
    .queue-container{
        margin: 0.5vh;
        height: 80%;
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