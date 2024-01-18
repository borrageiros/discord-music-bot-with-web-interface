<script>
  import io from 'socket.io-client';
  import Player from './lib/Player.svelte';
  import YoutubeSearcher from './lib/YoutubeSearcher.svelte';
  import SpotifySearcher from './lib/SpotifySearcher.svelte';
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
      console.log("🔴 - App.svelte::35 - data ->", data);
          appStatus = { ...appStatus, ...data };
      });

      socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
      });
  });

  let socket;
</script>


<main>
  <div class="windows">
    <div class="youtube">
      <YoutubeSearcher />
    </div>
    <div class="queue">
      <Queue appStatus={appStatus} />
      <ChannelChooser appStatus={appStatus} />
    </div>
    <div class="spotify">
      <SpotifySearcher />
    </div>
  </div>
  <Player appStatus={appStatus} />
</main>

<style>
  .windows{
    height: 82vh;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .youtube, .queue, .spotify{
    width: 33%;
  }
</style>
