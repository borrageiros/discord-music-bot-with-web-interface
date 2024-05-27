const express = require('express');
const cors = require('cors');
const { Player, GuildQueue } = require('discord-player');
const { Client, GatewayIntentBits, ActivityType, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const http = require('http');
const { Server } = require('socket.io');
const EventEmitter = require('events');
class ClientEmitter extends EventEmitter {}
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
const queue = new GuildQueue(player, {})
client.queue = queue;
player.extractors.loadDefault();

// DISCORD COMMANDS
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'discord', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}
console.log("🔴 - app.js::46 - client.commands.set(command.data.name ->", client.commands);

client.on("ready", () => {
    console.log(`🟢  Logged to discord with name: ${client.user.username}`);
	client.user.setPresence({
		activities: [{ name: `${process.env.ACTIVITY}`, type: ActivityType[process.env.ACTIVITY_TYPE] }],
		status: 1,
	});

    if (process.env.SKIP_UPDATE_COMMANDS !== "true") {
        (async () => {
            try {
                console.log("📤  Updating commands...")
                const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
                (async () => {
                    const guilds = client.guilds.cache.map(guild => ({ id: guild.id, name: guild.name }));
        
                    for (const guild of guilds) {
                        // Delete previus commands saved on the server
                        if (process.env.DELETE_PREVIUS_COMMANDS === "true") {
                            const commands = await rest.get(Routes.applicationGuildCommands(client.user.id, guild.id));
                            for (const command of commands) {
                                await rest.delete(Routes.applicationGuildCommand(client.user.id, guild.id, command.id));
                            }
                            console.log(`🆑  Deleted old commands for guild "${guild.name}"`);
                        }
        
                        // Add new commands in the server
                        await rest.put(
                            Routes.applicationGuildCommands(client.user.id, guild.id),
                            { body: client.commands.map(command => command.data.toJSON()) },
                        );
                        console.log(`🆕  Registered commands for guild "${guild.name}"`);
                    }
                    console.log("📤  All commands updated!!!")
                })();
            } catch (error) {
                console.error(error);
            }
        })();
    }
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
        clientEmitter.emit('clientChanged', client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on("disconnect", () => {
    clientEmitter.emit('clientChanged', client);
})

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