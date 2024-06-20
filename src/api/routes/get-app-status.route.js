const router = require('express').Router();
const { client, clientEmitter } = require('../../app');
const getAppStatus = require('../../middlewares/get-app-status');

console.log("+ Get-app-status command-route loaded");

router.get('/:discordGuild', async (req, res) => {
  const discordGuild = req.params.discordGuild;

  if (!discordGuild) {
    return res.status(400).json({ error: 'No discordGuild provided' });
  }

  if (!client.queues[discordGuild]) {
    return res.status(400).json({ error: 'There is no player on the provided discordGuild' });
  }

  try {
    const appStatus = await getAppStatus(client, discordGuild);
    clientEmitter.emit('clientChanged', client, discordGuild);
    res.status(200).json(appStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
});

module.exports = router;