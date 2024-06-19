<script>
    import { fly } from 'svelte/transition';
    import { notification, clearNotification } from './NotificationStore.js';

    import Icon from './Icon.svelte';
    // @ts-ignore
    import { FaSolidCircleExclamation, FaSolidCircleCheck, FaSolidXmark } from "svelte-icons-pack/fa";

    let visible = false;
    let message = '';
    let type = '';
    let seconds = 0;
    notification.subscribe(value => {
        ({ visible, message, type, seconds } = value);
    });

</script>

{#if visible}
<div class="notification {type}" in:fly={{ y: -200, duration: 500 }} out:fly={{ y: -200, duration: 500 }} on:click={clearNotification} on:keydown={clearNotification}>
    {#if type === "success"}
        <Icon src={FaSolidCircleCheck} size={"3vh"} color={"black"} style={"margin-left: 10px"} />
    {:else if type === "error"}
        <Icon src={FaSolidCircleExclamation} size={"3vh"} color={"black"} style={"margin-left: 10px"} />
    {/if}
    <p class="message">{message}</p>
    <Icon src={FaSolidXmark} size={"3vh"} color={"black"} onClick={clearNotification} style={"margin-left: 10px"} />
</div>
{/if}

<style>
    .notification {
        height: 10vh;
        width: 20vw;
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        padding: 10px;
        overflow-wrap: break-word;
        word-break: break-word;
        z-index: 1000;
    }
    .message {
        font-size: 1.3vw;
        flex-grow: 1;
        text-align: center;
    }
    .success {
        background-color: yellowgreen;
        border: rgb(57, 76, 19) 5px solid;
        color: black;
    }
    .error {
        background-color: rgb(255, 86, 86);
        border: red 5px solid;
        color: black;
    }

    @media (max-width: 1024px) {        
        .notification {
            height: 10vh;
            width: 70%;
        }
        .message {
            font-size: 5vw;
            flex-grow: 1;
            text-align: center;
        }
    }
</style>