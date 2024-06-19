<script>
    import Icon from './Icon.svelte';
    // @ts-ignore
    import { FaSolidBars } from "svelte-icons-pack/fa";

    export let phoneQueueVisible = false;

    function togglephoneQueueVisible() {
        phoneQueueVisible = !phoneQueueVisible;
    }
</script>

<div class="menu-container">
    <Icon src={FaSolidBars} size={"5vh"} onClick={togglephoneQueueVisible} color={"yellowgreen"} />
</div>

<style>
    .menu-container {
        margin: 1.5vh;
    }
    @media (min-width: 1025px) {
        .menu-container{
            display: none;
        }
    }
</style>