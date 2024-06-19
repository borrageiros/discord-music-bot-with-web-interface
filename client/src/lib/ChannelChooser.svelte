<script>
  export let appStatus;
  import { onMount } from "svelte";
  import { getChannels, connect } from "../api";
  import { getLocalStorage, setLocalStorage } from "../localStorage";
  import { showNotification } from "./NotificationStore";

  let channels = [];
  let selectedChannel = "";
  let guild;

  $: if (appStatus && appStatus.channel) {
    selectedChannel = appStatus.channel;
    if (guild && selectedChannel) {
      setLocalStorage(guild, "channel", selectedChannel);
    }
  }

  onMount(async () => {
    const currentUrl = window.location.href;
    try {
      const url = new URL(currentUrl);
      const params = new URLSearchParams(url.search);
      const res = await getChannels(params.get("guild"));
      guild = params.get("guild");
      channels = res.channels;
    } catch (error) {
      window.location.href = currentUrl.split("?")[0];
    }

    if (guild) {
      const channelInStorage = await getLocalStorage(guild, "channel");
      if (channelInStorage && selectedChannel === "") {
        selectedChannel = channelInStorage;
      }
    }
  });

  async function handleChannelSelection(event) {
    const channelId = event.target.value;
    await connect(channelId);
    if (guild) {
      setLocalStorage(guild, "channel", channelId);
    }
    showNotification("Channel selected", "success");
  }
</script>

<div class="channel-chooser-container">
  <select value={selectedChannel} on:change={handleChannelSelection}>
    <option disabled value="">Select a channel</option>
    {#each channels as channel}
      <option value={channel.id}>{channel.name}</option>
    {/each}
  </select>
</div>

<style>
  .channel-chooser-container {
    height: 100%;
    background-color: black;
    overflow: hidden;
    margin: 1vh;
  }
  .channel-chooser-container select {
    width: 100%;
    height: 100%;
    background: black;
    border: none;
    color: white;
    text-align: center;
    font-size: 1.5em;
  }
  .channel-chooser-container select:focus {
    outline: none;
  }
</style>
