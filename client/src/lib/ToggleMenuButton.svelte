<script>
    import menuSvg from '/icons/menu.svg';
    export let phoneQueueVisible = false;

    function togglephoneQueueVisible() {
        phoneQueueVisible = !phoneQueueVisible;
    }
</script>

<div class="menu-container">
    <img
        class="menu-svg"
        src={menuSvg} 
        alt="menu-svg" 
        on:click={togglephoneQueueVisible}
        on:keydown={togglephoneQueueVisible}
    />
</div>

<style>
    .menu-container {
        margin: 2vh;
        height: 4vh;
        cursor: pointer;
    }
    .menu-svg {
        height: 100%;
    }
    @media (min-width: 1025px) {
        .menu-container{
            display: none;
        }
    }
</style>