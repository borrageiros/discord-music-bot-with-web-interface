
# Discord music bot with web interface

Discord Music Bot with Real-Time Web Interface Using WebSockets

![screenshot](./readme/screenshot.jpg)

This application is a comprehensive "all-in-one" solution, which deploys all necessary services with a single command.

It is built upon:

- Graphical Interface: Leveraging the robust combination of Vite and Svelte for a sleek and responsive user experience.
- API/WebSockets: A powerful trio of Express, Socket.io, and discord.js orchestrates seamless real-time communication and interaction with Discord's API.

![scheme](./readme/scheme.png)
## 🚧 | Prerequisites
- [Node.js >= 20](https://nodejs.org/en/download/)
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [FFmpeg](https://ffmpeg.org/download.html)
## 📝 | Installation

- First of all you need to create a discord application in the [Discord Developer Portal](https://discord.com/developers/applications)

    - Save the token
    - Add the intents
        - PRESENCE INTENT
        - SERVER MEMBERS INTENT
        - MESSAGE CONTENT INTENT
    ![bot-intents](./readme/bot_intents.jpg)
    - Generate an invite URL with proper permissions
        - bot
            - Send Messages
            - Send Messages in Threads
            - Use Slash Commands
            - Connect
            - Speak
    ![bot-permissions](./readme/bot_permissions.png)

- Install requirements
    > This will run the command "yarn" (installation) in the server and client folders
```
yarn installation
```

- Configuration
    - Set variables in "config.js" and "client/config.js"
    - "config.js":
    ```
    module.exports = {
        app: {
            token: "",                          // Bot Secret Token
            author: 'borrageiros',              // Author
            guild: '',                          // Discord Server Id 
            activityType: "Listening",          // Activity of the bot: "Streaming", "Listening", "Watching", "Playing"
            activity: "music",                  // Text after the activityType, this example: Listening to music
            invite: "",                         // OPTIONAL - invite url
            frontUrl: "http://localhost:5173",  // Front app url (web)
            discordPlayer: {
                ytdlOptions: {
                    quality: 'highestaudio',
                    highWaterMark: 1 << 25
                }
            }
        },
    };

    ```
    - "client/config.js"
    ```
    const config = {
        apiUrl: "http://localhost:5678"     // API URL
    };
    export default config;
    ```
- Start
    > This will launch the server and the client
```
yarn start
```
## ℹ | Info
> **🔴Default ports of the application:**

- Interface: 5173

- API / WebSockets: 5678