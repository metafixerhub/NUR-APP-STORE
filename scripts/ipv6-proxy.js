const http = require('http');
const net = require('net');

const GITHUB_IPV6 = '2a00:1098:2c::5:141a:9cd7';

const server = http.createServer((req, res) => {
  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method Not Allowed');
});

server.on('connect', (req, clientSocket, head) => {
  const parts = req.url.split(':');
  const host = parts[0];
  const port = parseInt(parts[1], 10) || 443;
  const targetHost = (host === 'github.com' || host === 'api.github.com' || host.endsWith('github.com')) 
    ? GITHUB_IPV6 
    : host;

  const serverSocket = net.connect(port, targetHost, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    if (head && head.length > 0) {
      serverSocket.write(head);
    }
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  serverSocket.on('error', (err) => {
    clientSocket.end();
  });

  clientSocket.on('error', (err) => {
    serverSocket.end();
  });
});

server.listen(9999, '127.0.0.1', () => {
  console.log('IPv6 GitHub Tunnel Proxy active on 127.0.0.1:9999');
});
