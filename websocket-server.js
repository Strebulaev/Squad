const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send('Server received: ' + message);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
