const express = require('express');
const cors = require('cors');
const { Player, GuildQueue } = require('discord-player');
const { Client, GatewayIntentBits, ActivityType  } = require('discord.js');
const http = require('http');
const { Server } = require('socket.io');
const EventEmitter = require('events');
class ClientEmitter extends EventEmitter {}
const clientEmitter = new ClientEmitter();


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
client.config = require('../config');
const player = new Player(client, client.config.app.discordPlayer);
client.player = player;
const queue = new GuildQueue(player, {})
client.queue = queue;
player.extractors.loadDefault();
client.on("ready", () => {
    console.log(`Logged to discord with name: ${client.user.username}`);
	client.user.setPresence({
		activities: [{ name: `${client.config.app.activity}`, type: ActivityType[client.config.app.activityType] }],
		status: 1,
	});
});
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Rechazo de promesa no manejado:', promise, 'razón:', reason);
});
client.on("disconnect", () => {
    clientEmitter.emit('clientChanged', client);
})
client.login(client.config.app.token);
module.exports = { client, clientEmitter };
// DISCORD





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
    console.log('Cliente conectado');

    const sendUpdate = (updatedClient) => {
        const currentTrack = client.queue.currentTrack;
        const progressBar = client.queue.node.createProgressBar({separator: "", indicator: "", length: 1});
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

        const tracks = updatedClient.queue.tracks.toArray();
        const fullQueue = [currentTrack, ...tracks];
        const volumeString = updatedClient.queue.filters.volume ? updatedClient.queue.filters.volume.toString() : 0;
        const volumeNumber = volumeString && parseInt(volumeString.replace('%', ''), 10);
        const volume = volumeNumber && volumeNumber;
        let isPlaying
        if (updatedClient.queue.node.isPaused())
            isPlaying = false
        else{
            isPlaying = updatedClient.queue.isPlaying();
        }
        const connectedChannel = client.queue.channel;
        const isShuffling = client.queue.isShuffling;
        const isRepeating = client.queue.repeatMode;

        socket.emit('updateVariable', {
            currentTrack: currentTrackData,
            tracks: fullQueue,
            volume,
            isPlaying,
            channel: connectedChannel ? connectedChannel.id : null,
            shuffle: isShuffling,
            repeat: isRepeating
        });
    };

    sendUpdate(client);
    setInterval(() => sendUpdate(client), 5000);

    clientEmitter.on('clientChanged', (updatedClient) => {
        sendUpdate(updatedClient);
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