<script>
    import SongCard from './SongCard.svelte';
    import { deleteQueue } from '../api';
    import MenuButton from './ToggleMenuButton.svelte';
    import ChannelChooser from './ChannelChooser.svelte';

    import Icon from './Icon.svelte';
    // @ts-ignore
    import { FaSolidTrashCan } from "svelte-icons-pack/fa";
    import Loader from './LoaderSvg.svelte';

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
                <Icon src={FaSolidTrashCan} size={"5vh"} onClick={handleDeleteQueue} color={"red"} />
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
    .loader-svg {
        margin: 2vh;
        height: 5vh;
    }
</style>
