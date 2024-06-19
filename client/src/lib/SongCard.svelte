<script>
  import { showNotification } from "./NotificationStore";
  import { createEventDispatcher, onMount } from "svelte";
  import { getLocalStorage } from "../localStorage";
  import { moveTrack } from "../api";
  import Icon from "./Icon.svelte";
  import Loader from "./LoaderSvg.svelte";
  // @ts-ignore
  import { FaSolidCircleArrowUp, FaSolidCircleArrowDown, FaSolidTrashCan, FaSolidPlay } from "svelte-icons-pack/fa";

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
  export let handleSuccessfullyAddTrack = null;
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
      if ( handleSuccessfullyAddTrack ) {
        handleSuccessfullyAddTrack();
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
          <Icon src={FaSolidCircleArrowUp} size={"2.7vh"} onClick={handleArrowUp} color={"yellowgreen"} style={"padding: 5px"} />
        {/if}
        {#if arrayPosition >= 1 && !isLastItem}
          <Icon src={FaSolidCircleArrowDown} size={"2.7vh"} onClick={handleArrowDown} color={"yellowgreen"} style={"padding: 5px"} />
        {/if}
      </div>
      {#if isCurrentTrack}
        <Icon src={FaSolidTrashCan} size={"5vh"} onClick={handleSkip} color={"red"} />
      {:else}
        <Icon src={FaSolidTrashCan} size={"5vh"} onClick={handleDeleteTrack} color={"red"} style={"margin-left: 10px"} />
      {/if}
    {:else}
      <div class="loader">
        <Loader />
      </div>
    {/if}
  {:else if !isLoading}
    <Icon src={FaSolidPlay} size={"5vh"} onClick={handlePlaySong} color={"yellowgreen"} style={"margin-right: 3vw"}/>
  {:else}
    <div class="loader">
      <Loader />
    </div>
  {/if}
</div>

<style>
  .track-card {
    border: solid 2px #242424;
    width: calc(100% - 20px);
    height: 15vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding: 1vh;
    border-radius: 25px;
    margin: 10px;
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
  .loader {
    min-width: 5vh;
    max-width: 5vh;
    margin: 2vh;
    margin-right: 3vw;
    cursor: pointer;
  }
</style>
