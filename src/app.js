const express = require('express');
const cors = require('cors');
const { Player } = require('discord-player');
const { Client, EmbedBuilder, GatewayIntentBits, ActivityType, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const http = require('http');
const { Server } = require('socket.io');
const EventEmitter = require('events');
class ClientEmitter extends EventEmitter { }
const clientEmitter = new ClientEmitter();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// DISCORD
global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],
  disableMentions: 'everyone',
});
const player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25
  }
});
client.player = player;
client.defaultVolume = 30;
client.player.extractors.loadDefault();
client.queues = [];
client.sockets = [];

// DISCORD COMMANDS
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'discord', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.on("ready", () => {
  console.log(`🟣  Logged to discord with name: ${client.user.username}`);
  client.user.setPresence({
    activities: [{
      name: process.env.ACTIVITY || "music",
      type: ActivityType[process.env.ACTIVITY_TYPE] || ActivityType.Listening
    }],
    status: 1,
  });

  if (process.env.SKIP_UPDATE_COMMANDS !== "true") {
    (async () => {
      try {
        console.log("📤  Updating commands...")
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
        const commands = client.commands.map(command => command.data.toJSON());

        if (process.env.DELETE_PREVIUS_COMMANDS === "true") {
          await rest.delete(Routes.applicationCommands(client.user.id), { body: commands });
          console.log(`🆑  Deleted old commands`);
        }

        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log("📤  All commands updated");
      } catch (error) {
        console.error(error);
      }
    })();
  }
});

client.on("interactionCreate", async interaction => {
  // Execute discord commands and emit a client change event to the web clients
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
    clientEmitter.emit('clientChanged', client, interaction.guildId);
  } catch (error) {
    console.error(error);
    await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🔴 There was an error while executing this command!').setColor(0xe838cd)], ephemeral: true });
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  // !!!voiceStateUpdate gets all the voice channels events, not only bot states!!!!
  if ((client.user.id === oldState.id && client.user.id === newState.id)) {
    // HERE THE BOT WAS: MOVED, DISCONNECTED OR CHANGES HIS OWN VOICE STATE

    try {
      // If disconnected, delete queue for the discord guild
      if (oldState.channelId && (oldState.channelId !== newState.channelId) && (client.queues[oldState.guild.id] || client.queues[newState.guild.id])) {
        if (!newState.channelId && newState.id === client.user.id) {
          client.queues[oldState.guild.id].clear();
          delete client.queues[oldState.guild.id];
          clientEmitter.emit('clientChanged', client, oldState.guild.id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  } else if (client.queues[oldState.guild.id] && oldState.channelId === client.queues[oldState.guild.id].dispatcher.channel.id) {
    try {
      // If everybody leaves voice channel except the bot, leave channel and delete queue for the discord guild
      const connectedChannel = client.queues[oldState.guild.id].dispatcher.channel.id;
      const botChannel = client.channels.cache.get(connectedChannel);
      const memberCount = botChannel.members.size;
      if (botChannel && memberCount === 1) {
        client.queues[oldState.guild.id].dispatcher.disconnect();
        delete client.queues[oldState.guild.id];
        clientEmitter.emit('clientChanged', client, oldState.guild.id);
      }
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(process.env.TOKEN);
module.exports = { client, clientEmitter };
// FIN DISCORD




// API EXPRESS
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {

  // Generate the appStatus for the socket clients
  const sendUpdate = (updatedClient, discordGuild) => {

    const guild = client.guilds.cache.get(discordGuild);
    const botMember = guild ? guild.members.cache.get(client.user.id) : null;
    const botNickname = botMember ? botMember.nickname : null;

    if (client.queues[discordGuild]) {
      const currentTrack = client.queues[discordGuild].currentTrack;
      const progressBar = client.queues[discordGuild].node.createProgressBar({ separator: "", indicator: "", length: 1 });
      const times = progressBar && progressBar.split(" ");
      const currentDuration = progressBar && times[0];
      const currentTrackData = {
        id: currentTrack && currentTrack.id,
        title: currentTrack && currentTrack.title,
        description: currentTrack && currentTrack.duration,
        author: currentTrack && currentTrack.author,
        url: currentTrack && currentTrack.url,
        thumbnail: currentTrack && currentTrack.thumbnail,
        duration: currentTrack && currentTrack.duration,
        currentDuration: currentDuration, // ----
        durationMS: currentTrack && currentTrack.durationMS,
        views: currentTrack && currentTrack.views,
        requestedBy: currentTrack && currentTrack.requestedBy,
        playlist: currentTrack && currentTrack.playlist
      }

      const tracks = updatedClient.queues[discordGuild].tracks.toArray();
      const fullQueue = [currentTrack, ...tracks];
      const volumeString = updatedClient.queues[discordGuild].filters.volume ? updatedClient.queues[discordGuild].filters.volume.toString() : 0;
      const volumeNumber = volumeString && parseInt(volumeString.replace('%', ''), 10);
      const volume = volumeNumber && volumeNumber;
      let isPlaying
      if (client.queues[discordGuild].node.isPaused())
        isPlaying = false
      else {
        isPlaying = client.queues[discordGuild].isPlaying();
      }
      const connectedChannel = client.queues[discordGuild].channel;
      const isShuffling = client.queues[discordGuild].isShuffling;
      const isRepeating = client.queues[discordGuild].repeatMode;

      socket.to(discordGuild).emit('updateVariable', {
        currentTrack: currentTrackData,
        tracks: fullQueue,
        volume,
        isPlaying,
        channel: connectedChannel ? connectedChannel.id : null,
        shuffle: isShuffling,
        repeat: isRepeating,
        botNickname: botNickname
      });
    } else {
      socket.to(discordGuild).emit('updateVariable', {
        currentTrack: "",
        tracks: [],
        volume: client.defaultVolume,
        isPlaying: null,
        channel: null,
        shuffle: null,
        repeat: null,
        botNickname: botNickname ? botNickname : null
      });
    }
  };

  const updateAllSocketRooms = (updatedClient) => {
    Object.keys(updatedClient.sockets).forEach(socketId => {
      const discordGuild = updatedClient.sockets[socketId];
      if (discordGuild) {
        sendUpdate(updatedClient, discordGuild);
      }
    });
  }

  updateAllSocketRooms(client);
  setInterval(() => updateAllSocketRooms(client), 5000);

  clientEmitter.on('clientChanged', (updatedClient, discordGuild) => {
    sendUpdate(updatedClient, discordGuild);
  });

  socket.on('joinDiscordGuild', ({ discordGuild }) => {
    if (discordGuild) {
      socket.join(discordGuild);
      client.sockets[socket.id] = discordGuild;
      sendUpdate(client, discordGuild);
    }
  });

  socket.on('disconnect', () => {
    const discordGuild = client.sockets[socket.id];

    if (discordGuild) {
      socket.leave(discordGuild);
      delete client.sockets[socket.id];
    }
  });
});

const api = require('./api');
const { notFound, errorHandler } = require('./middlewares/errors.middleware');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/', api);
app.use(notFound);
app.use(errorHandler);


module.exports = server;
// API EXPRESS