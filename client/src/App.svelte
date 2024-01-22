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
    <div class="queue">
      <Queue appStatus={appStatus} />
      <ChannelChooser appStatus={appStatus} />
    </div>
    <div class="searcher">
      <Searcher />
    </div>
  </div>
  {#if appStatus.isPlaying}
    <Player appStatus={appStatus} />
  {/if}
</main>

<style>
  .windows{
    height: 82vh;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
   .queue {
    width: 33%;
  }
  .searcher {
    width: 66%;
  }
</style>
