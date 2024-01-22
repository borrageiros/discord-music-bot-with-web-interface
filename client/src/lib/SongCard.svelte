<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { getLocalStorage } from '../localStorage';
    export let id, title, channelTitle, url, img, isQueue;
    import TrashCanSvg from '/icons/trash-can.svg';
    import PlaySvg from '/icons/play.svg';
    import Loader from '/icons/Loader.svg';
    let isLoading;

    import { playSong, deleteTrack, getCurrentTrack, skip, getAppStatus } from '../api';

    let isCurrentTrack = false
    onMount(async () => {
        const currentTrack = await getCurrentTrack();
        if (currentTrack.message && currentTrack.message.id === id){
            isCurrentTrack = true;
        }
    });

    const dispatch = createEventDispatcher();

    async function handlePlaySong() {
        isLoading = true;
        await playSong( url, await getLocalStorage("channel")  );
        dispatch('remove');
    }
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handlePlaySong();
        }
    }

    async function handleDeleteTrack() {
        isLoading = true;
        await deleteTrack(url);
        dispatch('remove');
        isLoading = false;
    }

    function handleDeleteKeyPress(event) {
        if (event.key === 'Enter') {
            handleDeleteTrack();
        }
    }

    async function handleSkip() {
        isLoading = true;
        await skip();
        setTimeout(getAppStatus, 2000);
        setTimeout( () => isLoading = false, 2000 );
    }

    function handleSkipKeyPress(event) {
        if (event.key === 'Enter') {
        handleSkip();
        }
    }
</script>

<div class="track-card">
    <div class="track-info-container">
        <img class="track-img" src={img} alt="">
        <div class="track-info">
            <p>{title}</p>
            <p class="channel-title" >{channelTitle}</p>
        </div>
    </div>
    {#if isQueue}
        {#if !isLoading}
            {#if isCurrentTrack}
                <img class="trash-can-svg" src={TrashCanSvg} alt="delete" on:click={handleSkip} on:keydown={handleSkipKeyPress}>
            {:else}
                <img class="trash-can-svg" src={TrashCanSvg} alt="delete" on:click={handleDeleteTrack} on:keydown={handleDeleteKeyPress}>
            {/if}
        {:else}
            <img class="play-svg" src={Loader} alt="Loader" />
        {/if}
    {:else}
        {#if !isLoading}
            <img class="play-svg" src={PlaySvg} alt="play" on:click={handlePlaySong} on:keydown={handleKeyPress}>
        {:else}
            <img class="play-svg" src={Loader} alt="Loader" />
        {/if}
    {/if}
</div>

<style>
    .track-card{
        border: solid 2px #242424;
        width: 100%;
        height: 15vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
    }
    .track-info-container{
        height: inherit;
        display: flex;
        align-items: center;
    }
    .track-img{
        max-height: 70%;
        margin: 2vh;
    }
    .track-info{
        margin: 2vh;
    }
    .channel-title{
        color: gray;
    }
    .play-svg, .trash-can-svg{
        cursor: pointer;
        height: 5vh;
        margin: 2vh;
    }
</style>