const express = require('express');
const cors = require('cors');
const { Player, GuildQueue } = require('discord-player');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
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
    const command = new SlashCommandBuilder()
        .setName('play')
        .setDescription('Open the web reproducer and play a song')
        .addStringOption(option => 
            option.setName('song')
                .setDescription('URL or track name to play')
                .setRequired(true)
    );
    const commands = [
        command.toJSON()
    ];
    const rest = new REST({ version: '9' }).setToken(client.config.app.token);
    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, client.config.app.guild),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    })();
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    
    if (commandName  === 'play') {
        try {
            const query = interaction.options.getString('song');
            const results = await client.player.search(query, { searchEngine: "youtube" });
            const exampleEmbed = new EmbedBuilder()
            .setColor(0xe838cd)
            .setTitle(`Click here to reproduce this song on ${client.user.username}`)
            .setURL( client.config.app.frontUrl + "/?channel=" + interaction.member.voice.channelId + "&track=https://www.youtube.com/watch?v=" + results.tracks[0].id )
            .setDescription(results.tracks[0].title)
            .setImage(results.tracks[0].thumbnail)
            await interaction.reply({ embeds: [exampleEmbed] });
        } catch (error) {
            console.error(error);
        }
    }
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