const server = require('./app');

const port = process.env.PORT || 5678;

server.listen(port, () => {
    console.log(`Api and WebSocket Server is up at http://localhost:${port}`);
});