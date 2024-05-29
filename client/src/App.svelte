<script>
  import io from "socket.io-client";
  import Player from "./lib/Player.svelte";
  import Searcher from "./lib/Searcher.svelte";
  import Queue from "./lib/Queue.svelte";
  import ChannelChooser from "./lib/ChannelChooser.svelte";
  import GuildChooser from "./lib/GuildChooser.svelte";
  import { onMount } from "svelte";
  import { getAppStatus } from "./api";
  import Notifications from "./lib/Notification.svelte";

  let phoneQueueVisible = false; // In phone web version, define if the visible component is <Searcher> or <Queue>

  let appStatus = {
    tracks: [],
    volume: null,
    isPlaying: null,
    shuffle: null,
    repeat: null,
  };
  let guild;

  onMount(async () => {
    try {
      const initialStatus = await getAppStatus();
      appStatus = { ...appStatus, ...initialStatus };
    } catch (error) {
      console.error("Error fetching app status:", error);
    }

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    guild = params.get("guild");

    socket = io(currentUrl.split("?")[0]);

    socket.on("connect", (data) => {
      console.log("WebSocket connected");
    });

    socket.on("updateVariable", (data) => {
      appStatus = { ...appStatus, ...data };
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });
  });

  let socket;
</script>

<main>
  {#if guild}
    <div
      class="windows"
      style={appStatus.tracks[0] ? "height: 82vh;" : "height: 98vh;"}
    >
      <Notifications />

      <div class="left-side">
        {#if !phoneQueueVisible}
          <Searcher bind:phoneQueueVisible />
        {:else if phoneQueueVisible}
          <div class="queue">
            <Queue {appStatus} bind:phoneQueueVisible />
          </div>
          <div class="channel-chooser">
            <ChannelChooser {appStatus} />
          </div>
        {/if}
      </div>

      <div class="right-side">
        {#if !phoneQueueVisible}
          <div class="queue">
            <Queue {appStatus} />
          </div>
        {/if}

        <div class="channel-chooser">
          <ChannelChooser {appStatus} />
        </div>
      </div>
    </div>

    <div class="player">
      {#if appStatus.tracks[0]}
        <Player {appStatus} />
      {/if}
    </div>
  {:else}
    <GuildChooser />
  {/if}
</main>

<style>
  .windows {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .windows > div {
    margin: 1vh;
  }
  .left-side {
    height: 100%;
    width: 67%;
  }
  .right-side {
    width: 33%;
    height: 100%;
  }
  .queue {
    height: 80%;
    margin-bottom: 1vh;
  }
  .channel-chooser {
    height: 19%;
  }
  @media (max-width: 1024px) {
    .left-side {
      width: 100%;
    }
    .right-side {
      display: none;
    }
  }
</style>
