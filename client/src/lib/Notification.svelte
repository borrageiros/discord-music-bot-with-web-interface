<script>
    import { fly } from 'svelte/transition';
    import { notification, clearNotification } from './NotificationStore.js';
    import closeSvg from '/icons/x.svg';
    import alertSvg from '/icons/alert.svg';
    import checkSvg from '/icons/check.svg';

    let visible = false;
    let message = '';
    let type = '';
    let seconds = 0;
    notification.subscribe(value => {
        ({ visible, message, type, seconds } = value);
    });

</script>

{#if visible}
<div class="notification {type}" in:fly={{ y: -200, duration: 500 }} out:fly={{ y: -200, duration: 500 }}>
    {#if type === "success"}
        <img class="check-svg" src={checkSvg} alt="check-svg" />
    {:else if type === "error"}
        <img class="alert-svg" src={alertSvg} alt="alert-svg" />
    {/if}
    <p class="message">{message}</p>
    <img src={closeSvg} alt="close-x-svg" class="close-x-svg" on:click={clearNotification} on:keydown={clearNotification}/>
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
    .check-svg, .alert-svg, .close-x-svg {
        width: 3vh;
        cursor: pointer;
        margin-left: 10px;
    }
    .close-x-svg:hover{
        filter: invert(60%);
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