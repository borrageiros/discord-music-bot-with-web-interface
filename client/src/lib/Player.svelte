<script>
  import { showNotification } from './NotificationStore';
  import { onDestroy } from 'svelte';
  import { setVolume, pause, resume, skip, getAppStatus, toggleShuffle, toggleRepeat, seek } from '../api';
  import Icon from './Icon.svelte';
  import Loader from './LoaderSvg.svelte';

  // @ts-ignore
  import { FaSolidPlay, FaSolidPause, FaSolidForwardStep, FaSolidBackwardStep, FaSolidShuffle, FaSolidRepeat, FaSolidVolumeHigh, FaSolidVolumeXmark } from "svelte-icons-pack/fa";

  export let appStatus;

  let volume = appStatus.volume;
  let userIsInteracting = false;
  let currentDurationInSeconds = 0;
  let interval;
  let isSkipping = false;
  let isLive = appStatus.currentTrack && appStatus.currentTrack.duration === "0:00" && !appStatus.currentTrack.url.includes("apple");
  
  $: if (appStatus.volume !== volume && !userIsInteracting) {
    volume = appStatus.volume;
  }
  
  function startInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
      if (appStatus.isPlaying && !userIsInteracting) {
        currentDurationInSeconds += 1;
      }
    }, 1000);
  }
  startInterval();

  $: if (appStatus.currentTrack && appStatus.currentTrack.currentDuration) {
    currentDurationInSeconds = timeStringToNumber(appStatus.currentTrack.currentDuration);
    startInterval();
  }

  onDestroy(() => {
    clearInterval(interval);
  });

  function timeStringToNumber(timeString) {
    const parts = timeString.split(":").map(Number);
    let totalSeconds = 0;
    if (parts.length === 3) {
      totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      totalSeconds = parts[0] * 60 + parts[1];
    }else {
      totalSeconds = 100 // default
    }
    return totalSeconds;
  }

  function secondsToMinute(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    if (hours > 0) {
      return `${formattedHours}:${formattedMins}:${formattedSecs}`;
    } else {
      return `${formattedMins}:${formattedSecs}`;
    }
  }

  function handleInputStart() {
    userIsInteracting = true;
  }

  function handleVolumeInput() {
    userIsInteracting = false;
    sendVolume();
  }

  async function sendVolume() {
    await setVolume(volume);
    appStatus.volume = volume; 
  }

  function handleSeek(event) {
    userIsInteracting = true;
    const newDurationInSeconds = +event.target.value;
    currentDurationInSeconds = newDurationInSeconds <= 0 ? 0 : newDurationInSeconds;

    if (event.type === 'change') {
      userIsInteracting = false;
      const newDurationInMilliseconds = newDurationInSeconds * 1000;
      seekAndUpdateAppStatus(newDurationInMilliseconds);
    }
  }

  async function seekAndUpdateAppStatus(newDurationInMilliseconds) {
    await seek(newDurationInMilliseconds);
    setTimeout(getAppStatus, 2000);
  }

  async function handlePause() {
    await pause();
    appStatus.isPlaying = false;
  }

  async function handleResume() {
    await resume();
    appStatus.isPlaying = true;
  }

  async function handleBackward() {
    showNotification("Not implemented", "success");
  }

  async function handleSkip() {
    isSkipping = true;
    await skip();
    setTimeout(getAppStatus, 2000);
    setTimeout( () => isSkipping = false, 2000);
  }

  async function handleShuffle() {
    await toggleShuffle();
    setTimeout(getAppStatus, 2000);
  }

  async function handleRepeat() {
    await toggleRepeat();
    setTimeout(getAppStatus, 2000);
  }
</script>

<div class="player">
  
  {#if appStatus.tracks[0]}
  <div class="track-info">
    <img class="track-image" src={appStatus.currentTrack && appStatus.currentTrack.thumbnail} alt="">
    <div class="track-title">
      <p>{ appStatus.currentTrack ? appStatus.currentTrack.title : "" }</p>
      <p>{ appStatus.currentTrack ? appStatus.currentTrack.author : "" }</p>
      {#if isLive}
        <div class="on-live">
          <p>🔴 On Live</p>
        </div>
      {/if}
    </div>
  </div>

  <div class="controls-container">

    <div class="controls">
      {#if appStatus.shuffle}
        <Icon src={FaSolidShuffle} size={"3vh"} onClick={handleShuffle} color={"red"} />
      {:else}
        <Icon src={FaSolidShuffle} size={"3vh"} onClick={handleShuffle} color={"yellowgreen"} />
      {/if}
      
      <Icon src={FaSolidBackwardStep} size={"3vh"} onClick={handleBackward} color={"yellowgreen"} />

      {#if appStatus.isPlaying}
        <Icon src={FaSolidPause} size={"6vh"} onClick={handlePause} color={"yellowgreen"} />
      {:else}
        <Icon src={FaSolidPlay} size={"6vh"} onClick={handleResume} color={"yellowgreen"} />
      {/if}

      {#if !isSkipping}
        <Icon src={FaSolidForwardStep} size={"3vh"} onClick={handleSkip} color={"yellowgreen"} />
      {:else}
        <div class="loader">
          <Loader />
        </div>
      {/if}

      {#if appStatus.repeat === 1}
        <Icon src={FaSolidRepeat} size={"3vh"} onClick={handleRepeat} color={"red"} />
      {:else}
        <Icon src={FaSolidRepeat} size={"3vh"} onClick={handleRepeat} color={"yellowgreen"} />
      {/if}

    </div>

    {#if isLive && window.innerWidth <= 1024}
      <div class="track-info-phone-version">
        <p>🔴 On Live</p>
      </div>
    {/if}

    <div class="song-state-container">
      {#if appStatus.currentTrack && appStatus.currentTrack.duration !== "0:00"}
        <p>{ secondsToMinute(currentDurationInSeconds) }</p>
        <input
          class="song-state"
          type="range"
          min={ -1 }
          max={ timeStringToNumber(appStatus.currentTrack.duration) }
          value={ currentDurationInSeconds }
          on:input={handleSeek}
          on:change={handleSeek}
        >
        <p>{ appStatus.currentTrack.duration }</p>
      {/if}
    </div>

  </div>
  
  <div class="volume">
    
    {#if appStatus.volume > 0}
      <Icon src={FaSolidVolumeHigh} size={"3vh"} color={"yellowgreen"} />
    {:else}
      <Icon src={FaSolidVolumeXmark} size={"3vh"} color={"yellowgreen"} />
    {/if}
    
    <div class="volume-input-container">
      <input 
          class="volume-input" 
          type="range" 
          min={-1}
          max="100" 
          bind:value={volume} 
          on:input={handleInputStart}
          on:change={handleVolumeInput}
      />
    </div>
    
  </div>
  {/if}
  
</div>

<style>
  .player {
    width: 100%;
    height: 15vh;
    background-color: black;
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .track-info {
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center; 
  }

  .track-info .track-image {
    max-height: 70%;
    max-width: 20vw;
    margin: 1vw;
  }

  .track-title {
    display: flex;
    flex-direction: column;
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    max-width: 20vh; 
  }

  .on-live {
    font-size: 2vh;
  }

  .controls-container {
    width: 60%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .controls {
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .song-state-container, .song-state{
    width: 100%;
  }

  .song-state-container{
    display: flex;
  }

  .song-state-container > * {
    margin: 1vh;
  }

  .volume {
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .volume > * {
    margin: 1vh;
  }
  .volume-input-container{
    width: 60%;
  }
  .volume-input{
    cursor: pointer;
  }

  .volume-input {
    border-radius: 25px;
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 25px;
    background: #ddd;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .volume-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: yellowgreen;
    cursor: pointer;
  }

  .volume-input::-moz-range-thumb {
      width: 25px;
      height: 25px;
      background: yellowgreen;
      cursor: pointer;
  }
  .loader {
    width: 1.5vh;
  }

  @media (max-width: 1024px) {
    .controls-container{
      width: 100%;
    }
    .volume, .track-info {
      display: none;
    }
    .track-info-phone-version {
      width: 20%;
      margin-bottom: 2vh;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center; 
      font-size: 3.8vw;
    }
    .controls {
      justify-content: space-between;
    }
  }
</style>