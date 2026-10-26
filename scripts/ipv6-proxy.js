const http = require('http');
const net = require('net');
const dns = require('dns');

const resolver = new dns.Resolver();
resolver.setServers(['2a00:1098:2c::1', '2a01:4f8:c2c:123f::1']);

const cache = new Map();

async function resolveHost(host) {
  if (net.isIP(host)) return host;
  if (cache.has(host)) return cache.get(host);

  try {
    const addresses = await new Promise((resolve, reject) => {
      resolver.resolve6(host, (err, addrs) => {
        if (err || !addrs || addrs.length === 0) reject(err);
        else resolve(addrs);
      });
    });
    const selected = addresses[0];
    cache.set(host, selected);
    setTimeout(() => cache.delete(host), 300000);
    return selected;
  } catch (err) {
    return host;
  }
}

const PAC_CONTENT = `function FindProxyForURL(url, host) {
    if (shExpMatch(host, "*.github.com") || host === "github.com" || shExpMatch(host, "*.githubusercontent.com") || shExpMatch(host, "*.githubassets.com") || host === "github.io" || shExpMatch(host, "*.github.io")) {
        return "PROXY 127.0.0.1:9999";
    }
    return "DIRECT";
}`;

const server = http.createServer((req, res) => {
  if (req.url === '/proxy.pac' || req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'application/x-ns-proxy-autoconfig',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(PAC_CONTENT);
    return;
  }
  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method Not Allowed');
});

server.on('connect', async (req, clientSocket, head) => {
  const parts = req.url.split(':');
  const host = parts[0];
  const port = parseInt(parts[1], 10) || 443;

  try {
    const targetHost = await resolveHost(host);
    const serverSocket = net.connect(port, targetHost, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      if (head && head.length > 0) {
        serverSocket.write(head);
      }
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });

    serverSocket.on('error', () => clientSocket.end());
    clientSocket.on('error', () => serverSocket.end());
  } catch (err) {
    clientSocket.end();
  }
});

server.listen(9999, '127.0.0.1', () => {
  console.log('IPv6 GitHub Tunnel Proxy active on 127.0.0.1:9999');
});
