<script>
  import io from "socket.io-client";
  import Player from "./lib/Player.svelte";
  import Searcher from "./lib/Searcher.svelte";
  import Queue from "./lib/Queue.svelte";
  import GuildChooser from "./lib/GuildChooser.svelte";
  import { onMount } from "svelte";
  import { getAppStatus } from "./api";
  import Notifications from "./lib/Notification.svelte";
  import { setLocalStorage } from "./localStorage";

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
      if (initialStatus.botNickname) {
        document.title = initialStatus.botNickname;
      }
      appStatus = { ...appStatus, ...initialStatus };
    } catch (error) {
      console.error("Error fetching app status:", error);
    }

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    guild = params.get("guild");

    socket = io(currentUrl.split("?")[0]);
    // socket = io("http://localhost:3000/");

    socket.on("connect", (data) => {
      console.log("WebSocket connected");
      socket.emit("joinDiscordGuild", { discordGuild: guild && guild });
    });

    socket.on("updateVariable", (data) => {
      appStatus = { ...appStatus, ...data };

      if (appStatus.botNickname) {
        document.title = appStatus.botNickname;
      }

      const selectedChannel = appStatus.channel;
      if (guild && selectedChannel) {
        setLocalStorage(guild, "channel", selectedChannel);
      }
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

      <div class="left-side" style={appStatus.tracks[0] ? "width: 67%;" : "width: 100%;"}>
        {#if !phoneQueueVisible}
          <Searcher {appStatus} bind:phoneQueueVisible />
        {:else if phoneQueueVisible}
          <div class="queue">
            <Queue {appStatus} bind:phoneQueueVisible />
          </div>
        {/if}
      </div>

      <div class="right-side" style={appStatus.tracks[0] ? "width: 33%;" : "width: 0%;"}>
        {#if !phoneQueueVisible && appStatus.tracks[0]}
          <div class="queue">
            <Queue {appStatus} />
          </div>
        {/if}
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
  .left-side {
    height: 100%;
  }
  .right-side {
    
    height: 100%;
  }
  .queue {
    height: 100%;
    margin-bottom: 1vh;
    border-radius: 25px;
  }
  @media (max-width: 1024px) {
    .left-side {
      width: 100% !important;
    }
    .right-side {
      display: none;
    }
  }
</style>
