const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
   
  console.log('Client connected');
  console.log("cline kết nối ",ws);
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send('Hello from server');
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

console.log('WebSocket server is listening on ws://localhost:8080');
