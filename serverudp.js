const WebSocket = require('ws');
const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');

const UDP_PORT = 12345;
const WS_PORT = 8080;

// UDP server
udpServer.bind(UDP_PORT, () => {
  console.log(`UDP Server listening on port ${UDP_PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    console.log(`Received WebSocket message: ${message}`);
    // Send message to UDP server
    udpServer.send(message, UDP_PORT, 'localhost', (err) => {
      if (err) {
        console.error('Failed to send UDP message:', err);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log(`WebSocket Server listening on port ${WS_PORT}`);
