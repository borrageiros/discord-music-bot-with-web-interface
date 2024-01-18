<script>
    export let appStatus;
    import { onMount } from 'svelte';
    import { getChannels, connect } from '../api';
    import { setLocalStorage } from '../localStorage';

    let channels = [];
    let selectedChannel;
    $: if (appStatus && appStatus.channel){
        selectedChannel = appStatus.channel
        setLocalStorage("channel", selectedChannel)
    }

    onMount(async () => {
        const res = await getChannels();
        channels = res.channels;
    });

    async function handleChannelSelection(event) {
        const channelId = event.target.value;
        await connect(channelId)
        setLocalStorage("channel", channelId)
    }
</script>

<div class="channel-chooser-container">
    <select bind:value={selectedChannel} on:change={handleChannelSelection}  >
        <option disabled selected value="">Select a channel</option>
        {#each channels as channel}
            <option value={channel.id}>{channel.name}</option>
        {/each}
    </select>
</div>

<style>
    .channel-chooser-container{
        margin: 0.5vh;
        height: 20%;
        background-color: black;
        overflow: hidden;
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
</style>
