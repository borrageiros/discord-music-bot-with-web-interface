<script>
  import io from 'socket.io-client';
  import Player from './lib/Player.svelte';
  import Searcher from './lib/Searcher.svelte';
  import Queue from './lib/Queue.svelte';
  import ChannelChooser from './lib/ChannelChooser.svelte';
  import { onMount } from 'svelte';
  import { getAppStatus } from './api';
  import config from "../config"

  let appStatus = {
      tracks: [],
      volume: null,
      isPlaying: null,
      shuffle: null,
      repeat: null
  };

  onMount(async () => {
      try {
          const initialStatus = await getAppStatus();
          appStatus = { ...appStatus, ...initialStatus };
      } catch (error) {
          console.error('Error fetching app status:', error);
      }

      socket = io(config.apiUrl);

      socket.on('connect', (data) => {
          console.log('WebSocket connected');
      });

      socket.on('updateVariable', ( data ) => {
          appStatus = { ...appStatus, ...data };
      });

      socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
      });
  });

  let socket;
</script>


<main>
  <div class="windows" style={ appStatus.isPlaying ? "height: 82vh;" : "height: 98vh;"}>
    <div class="left-side">
      <Searcher />
    </div>
    <div class="right-side">
      <div class="queue">
        <Queue appStatus={appStatus} />
      </div>
      <div class="channel-chooser">
        <ChannelChooser appStatus={appStatus} />
      </div>
    </div>
  </div>
  <div class="player">
    {#if appStatus.isPlaying}
      <Player appStatus={appStatus} />
    {/if}
  </div>
</main>

<style>
  .windows{
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .windows > div{
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
  .queue{
    height: 80%;
  }
  .channel-chooser{
    height: 20%;
  }
</style>
