<script>
  let guild = "";
  const currentUrl = window.location.href;
  const newUrl = currentUrl.split("?")[0];

  function redirectToGuild() {
    if (guild.trim() !== "") {
      window.location.href = `${newUrl}?guild=${guild}`;
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      redirectToGuild();
    }
  }
</script>

<div class="guild-chooser-main">
  <div class="guild-chooser-container">
    <p>No server selected, please enter the server ID or use the "/link" command in Discord</p>
    <div>
      <input
        type="text"
        bind:value={guild}
        placeholder="Enter server ID"
        on:keypress={handleKeyPress}
      />
      <button on:click={redirectToGuild}>Go</button>
    </div>
  </div>
</div>


<style>
  .guild-chooser-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .guild-chooser-container {
    padding: 20px;
    width: 300px;
    text-align: center;
    font-size: x-large;
  }

  .guild-chooser-container p {
    margin-bottom: 20px;
  }

  .guild-chooser-container input[type="text"] {
    width: calc(100% - 20px);
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
  }

  .guild-chooser-container button {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .guild-chooser-container button:hover {
    background-color: #0056b3;
  }
</style>
