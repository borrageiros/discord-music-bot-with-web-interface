<script>
    import SongCard from './SongCard.svelte';
    import PlaySvg from '/icons/play.svg';
    import TrashCanSvg from '/icons/trash-can.svg';
    import { deleteQueue } from '../api';
    import MenuButton from './ToggleMenuButton.svelte';
    import Loader from './LoaderSvg.svelte';
    import ChannelChooser from './ChannelChooser.svelte';

    export let phoneQueueVisible = false;
    export let appStatus;

    let loading = false;

    async function handleDeleteQueue() {
        loading = true;
        await deleteQueue();
        loading = false;
    }
</script>

<div class="queue-container">
    <div class="queue sticky-searcher">
        <ChannelChooser {appStatus} />
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
        border-radius: 25px;
        margin: 1vh;
        -ms-overflow-style: none;  /* Internet Explorer, Edge */
        scrollbar-width: none; /* Internet Explorer, Edge */
    }
    .queue-container::-webkit-scrollbar {
        display: none;  /* Chrome, Safari, Opera */
    }
    .queue-results{
        display: flex;
        flex-direction: column;
        align-items: center;
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
</style>
