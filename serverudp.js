const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 12345;

server.on('message', (msg, rinfo) => {
  console.log(`Received UDP message: ${msg} from ${rinfo.address}:${rinfo.port}`);
  // Xử lý dữ liệu UDP ở đây
});

server.on('error', (err) => {
  console.error(`UDP server error:\n${err.stack}`);
  server.close();
});

server.bind(PORT, () => {
  console.log(`UDP Server listening on port ${PORT}`);
});
