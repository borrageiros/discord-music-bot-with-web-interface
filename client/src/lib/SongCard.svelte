<script>
  import { showNotification } from "./NotificationStore";
  import { createEventDispatcher, onMount } from "svelte";
  import { getLocalStorage } from "../localStorage";
  import { moveTrack } from "../api";
  export let id,
    title,
    channelTitle,
    url,
    img,
    isQueue,
    isLive,
    duration,
    arrayPosition,
    isLastItem;
  import ArrowDown from "/icons/arrow-down.svg";
  import ArrowUp from "/icons/arrow-up.svg";
  import TrashCanSvg from "/icons/trash-can.svg";
  import PlaySvg from "/icons/play.svg";
  import Loader from "./LoaderSvg.svelte";
  let isLoading;

  import {
    playSong,
    deleteTrack,
    getCurrentTrack,
    skip,
    getAppStatus,
  } from "../api";

  let isCurrentTrack = false;
  let guild;
  const currentUrl = window.location.href;
  const weburl = new URL(currentUrl);
  const params = new URLSearchParams(weburl.search);
  guild = params.get("guild");

  onMount(async () => {
    const currentTrack = await getCurrentTrack();
    if (currentTrack.message && currentTrack.message.id === id) {
      isCurrentTrack = true;
    }
  });

  const dispatch = createEventDispatcher();

  async function handleDivClick() {
    if (!isQueue && !isLoading) {
      handlePlaySong();
    }
  }

  async function handlePlaySong() {
    isLoading = true;
    let channel;
    if (guild) {
      channel = await getLocalStorage(guild, "channel");
    }
    if (channel) {
      await playSong(url, channel);
      dispatch("remove");
      if (window.innerWidth <= 1024) {
        // Show notification for phones or tablets
        showNotification("Song added", "success");
      }
    } else {
      showNotification("You must select a channel first", "error", 3);
      isLoading = false;
    }
  }

  async function handleDeleteTrack() {
    isLoading = true;
    await deleteTrack(url);
    showNotification("Song deleted from queue", "success");
    dispatch("remove");
    isLoading = false;
  }

  async function handleSkip() {
    isLoading = true;
    await skip();
    setTimeout(getAppStatus, 2000);
    setTimeout(
      () => showNotification("Song deleted from queue", "success"),
      2000,
    );
    setTimeout(() => (isLoading = false), 2000);
  }

  async function handleArrowUp() {
    await handleMoveTrack(arrayPosition, arrayPosition - 1);
    setTimeout(getAppStatus, 2000);
  }

  async function handleArrowDown() {
    await handleMoveTrack(arrayPosition, arrayPosition + 1);
    setTimeout(getAppStatus, 2000);
  }

  async function handleMoveTrack(from, to) {
    await moveTrack(from - 1, to - 1);
  }
</script>

<div
  class="track-card"
  style={!isQueue && "cursor: pointer;"}
  on:click={handleDivClick}
  on:keydown={handleDivClick}
>
  <div class="track-info-container">
    <img class="track-img" src={img} alt="" />
    <div class="track-info">
      <p class="track-title">{title}</p>
      <p class="channel-title">{channelTitle}</p>
      {#if !isLive}
        <p class="channel-title">{duration ? duration : ""}</p>
      {:else}
        <p class="channel-title">{isLive && "🔴 Live"}</p>
      {/if}
    </div>
  </div>
  {#if isQueue}
    {#if !isLoading}
      <div class="move-track-controls">
        {#if arrayPosition >= 2}
          <img
            class="arrow-svg"
            src={ArrowUp}
            alt="delete"
            on:click={handleArrowUp}
            on:keydown={handleArrowUp}
          />
        {/if}
        {#if arrayPosition >= 1 && !isLastItem}
          <img
            class="arrow-svg"
            src={ArrowDown}
            alt="delete"
            on:click={handleArrowDown}
            on:keydown={handleArrowDown}
          />
        {/if}
      </div>
      {#if isCurrentTrack}
        <img
          class="trash-can-svg"
          src={TrashCanSvg}
          alt="delete"
          on:click={handleSkip}
          on:keydown={handleSkip}
        />
      {:else}
        <img
          class="trash-can-svg"
          src={TrashCanSvg}
          alt="delete"
          on:click={handleDeleteTrack}
          on:keydown={handleDeleteTrack}
        />
      {/if}
    {:else}
      <div class="loader">
        <Loader />
      </div>
    {/if}
  {:else if !isLoading}
    <img
      class="play-svg"
      src={PlaySvg}
      alt="play"
      on:click={handlePlaySong}
      on:keydown={handlePlaySong}
    />
  {:else}
    <div class="loader">
      <Loader />
    </div>
  {/if}
</div>

<style>
  .track-card {
    border: solid 2px #242424;
    width: 100%;
    height: 15vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding: 1vh;
  }
  .track-info-container {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
  .track-img {
    max-height: 13vh;
    max-width: 30%;
    margin: 2vh;
  }
  .track-info {
    font-size: 1.5vh;
  }
  .track-title {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .channel-title {
    color: gray;
  }
  .move-track-controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 0;
    flex-shrink: 0;
    height: 100%;
    align-self: flex-end;
  }
  .arrow-svg,
  .arrow-svg {
    max-height: 3vh;
    margin: 1vh;
    cursor: pointer;
  }
  .arrow-svg:hover,
  .arrow-svg:hover {
    filter: grayscale(60%);
  }
  .play-svg,
  .trash-can-svg {
    height: 5vh;
    margin: 2vh;
    cursor: pointer;
  }
  .loader {
    min-width: 5vh;
    max-width: 5vh;
    margin: 2vh;
    cursor: pointer;
  }
</style>
