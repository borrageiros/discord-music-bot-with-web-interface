<!-- https://leshak.github.io/svelte-icons-pack/#/ -->
<script>
  import { Icon } from 'svelte-icons-pack';

  export let src;
  export let color = "yellowgreen";
  export let size = "1em";
  export let viewBox = undefined;
  export let className = undefined;
  export let title = undefined;
  export let onClick = undefined;
  export let style = "";
  export let parentClass = "";

  function handleClick(event) {
    if (onClick) {
      onClick(event);
    }
  }
</script>

<div {style} class={`icon ${parentClass}`} on:click={handleClick} on:keydown={handleClick}>
  <Icon {src} {color} {size} {viewBox} {className} {title} />
</div>

<style>
  .icon {
    cursor: pointer;
  }
</style>
