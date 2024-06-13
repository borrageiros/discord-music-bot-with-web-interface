<script>
    import SongCard from './SongCard.svelte';
    import PlaySvg from '/icons/play.svg';
    import TrashCanSvg from '/icons/trash-can.svg';
    import { playSong, deleteQueue } from '../api';
    import MenuButton from './ToggleMenuButton.svelte';
    import Loader from './LoaderSvg.svelte';

    export let phoneQueueVisible = false;
    export let appStatus;

    let searchQuery = '';
    let loading = false;

    async function sendLink() {
        loading = true;
        await playSong(searchQuery, appStatus.channel && appStatus.channel);
        searchQuery = '';
        loading = false;
    }

    async function handleDeleteQueue() {
        loading = true;
        await deleteQueue();
        loading = false;
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            sendLink();
        }
    }
</script>

<div class="queue-container">
    <div class="queue sticky-searcher">
        {#if loading}
            <div class="loader-svg">
                <Loader />
            </div>
        {:else}
            {#if appStatus && appStatus.tracks && appStatus.tracks.length > 1}
                <img class="queue-trash-can" src={TrashCanSvg} alt="delete-queue" on:click={handleDeleteQueue} on:keydown={handleDeleteQueue}>
            {:else}
                <img class="queue-logo" src={PlaySvg} alt="">
            {/if}
        {/if}
        <input 
            class="queue-input" 
            type="text" 
            bind:value={searchQuery}
            on:keydown={handleKeyDown}
            placeholder="Add link to queue..."
        >
        <MenuButton bind:phoneQueueVisible={phoneQueueVisible} />
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
    .queue-container {
        height: 100%;
        background-color: black;
        overflow: scroll;
        overflow-x: hidden;
    }
    .queue {
        min-height: 9vh;
        border-bottom: solid 2px #242424;
        display: flex;
        align-items: center;
        justify-content: space-around;
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
    .queue-trash-can, .queue-logo, .loader-svg {
        margin: 2vh;
        height: 5vh;
    }
    .queue-trash-can {
        cursor: pointer;
    }
    .queue-input {
        width: 80%;
        margin-right: 1vh;
        height: 3vh;
        padding: 2vh;
    }
    @media (max-width: 1024px) {
        .queue-input {
            width: 55%;
        }
    }
</style>
