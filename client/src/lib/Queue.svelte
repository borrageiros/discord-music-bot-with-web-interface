<script>
    import SongCard from './SongCard.svelte';
    import { onMount } from 'svelte';
    import PlaySvg from '/icons/play.svg'
    import { playSong, moveTrack } from '../api';

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

    let draggedItem = null;
    let overItem = null;

    function handleDragStart(event, track) {
        draggedItem = track;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', event.target.innerHTML);
    }

    function handleDragOver(event, track) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        overItem = track;
    }

    function handleDrop(event, track) {
        event.stopPropagation();
        if (draggedItem && overItem && draggedItem.id !== overItem.id) {
            const fromIndex = appStatus.tracks.indexOf(draggedItem);
            const toIndex = appStatus.tracks.indexOf(overItem);
            handleMoveTrack( fromIndex - 1 , toIndex - 1 );
        }
        draggedItem = null;
        overItem = null;
    }

    function handleDragEnd(event) {
        draggedItem = null;
        overItem = null;
    }

    async function handleMoveTrack( from, to ) {
        await moveTrack( from, to );
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
            {#each appStatus.tracks as track, index (track.id)}
                <div class="draggable" draggable={index !== 0 && true}
                    on:dragstart={(event) => handleDragStart(event, track)}
                    on:dragover={(event) => handleDragOver(event, track)}
                    on:drop={(event) => handleDrop(event, track)}
                    on:dragend={handleDragEnd}
                    on:click={() => draggedItem = null}
                    on:keydown={() => draggedItem = null}
                >
                    <SongCard
                        isQueue={true}
                        isLive={ track.durationMS === 0 && !track.url.includes("apple") ? true : false }
                        duration={ track.duration && !track.url.includes("apple") ? track.duration : "" }
                        id={track.id}
                        title={track.title}
                        channelTitle={track.author}
                        url={track.url}
                        img={track.thumbnail}
                    />
                </div>
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