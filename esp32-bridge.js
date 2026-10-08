// esp32-bridge.js
// Lightweight Node.js bridge to receive ESP32 ultrasonic readings and push real-time alerts to the driver frontend.
import http from 'http';

const PORT = process.env.PORT || 5000;
let sseClients = [];
let lastTelemetry = {
  binId: 'BIN-101',
  isFull: false,
  distanceCm: null,
  receivedAt: null
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. ESP32 Telemetry Endpoint (called by ESP32)
  if (req.method === 'POST' && req.url === '/api/telemetry') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const binId = data.binId || 'BIN-101';
        const isFull = data.isFull === true || (typeof data.distanceCm === 'number' && data.distanceCm <= 15);
        const distanceCm = data.distanceCm ?? null;

        lastTelemetry = {
          binId,
          isFull,
          distanceCm,
          receivedAt: new Date().toLocaleTimeString()
        };

        console.log(`\n📡 [ESP32 SIGNAL RECEIVED] Bin: ${binId} | Distance: ${distanceCm}cm | Full: ${isFull ? '🚨 YES' : 'NO'}`);

        // Broadcast to all connected driver frontend sessions via Server-Sent Events (SSE)
        const eventPayload = JSON.stringify({
          type: isFull ? 'BIN_FULL' : 'BIN_NORMAL',
          binId,
          isFull,
          distanceCm,
          timestamp: lastTelemetry.receivedAt
        });

        sseClients.forEach(client => {
          client.write(`data: ${eventPayload}\n\n`);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          status: isFull ? 'DRIVER_ALERTED' : 'NORMAL',
          message: isFull ? `Driver alerted: ${binId} is now FULL!` : 'Reading logged.'
        }));
      } catch (err) {
        console.error('Error parsing ESP32 payload:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 2. Real-time Server-Sent Events (SSE) stream for Frontend
  if (req.method === 'GET' && req.url === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'ESP32 Bridge Live' })}\n\n`);
    sseClients.push(res);

    req.on('close', () => {
      sseClients = sseClients.filter(c => c !== res);
    });
    return;
  }

  // 3. Status check endpoint
  if (req.method === 'GET' && req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      bridgeStatus: 'ONLINE',
      port: PORT,
      connectedFrontendClients: sseClients.length,
      lastTelemetry
    }));
    return;
  }

  // 4. Manual Test / Simulation endpoint
  if (req.method === 'POST' && req.url === '/api/simulate-full') {
    const payload = JSON.stringify({
      type: 'BIN_FULL',
      binId: 'BIN-101',
      isFull: true,
      timestamp: new Date().toLocaleTimeString()
    });
    sseClients.forEach(client => {
      client.write(`data: ${payload}\n\n`);
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Simulated full-bin alert sent to driver!' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log(`🚀 ESP32 IoT Bridge Server is LIVE on port ${PORT}!`);
  console.log(`👉 ESP32 should POST to: http://<YOUR_COMPUTER_IP>:${PORT}/api/telemetry`);
  console.log(`👉 Live SSE stream on:   http://localhost:${PORT}/api/events`);
  console.log('====================================================\n');
});
