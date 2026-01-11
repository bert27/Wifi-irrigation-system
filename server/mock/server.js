const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock Data
let waterPumps = {
    1: 0,
    2: 0,
    3: 0,
    4: 0
};

// Create HTTP Server
const server = http.createServer(app);

// Create WebSocket Server
const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Send initial state or data if needed
    ws.send(JSON.stringify({ type: 'STATUS', message: 'Connected to Mock Backend' }));

    ws.on('message', (message) => {
        console.log('Received via WS:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Broadcast helper
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// --- API Endpoints simulating ESP8266 ---

app.get('/', (req, res) => {
    res.send('Servidor robot');
});

// Control Bomba / PWM
// Equivalent to: server.on("/waterPump1OnOFF", ...)
// Params: 0=id, 1=pwm, 2=time
app.get('/waterPump1OnOFF', (req, res) => {
    // In Express query params are in req.query
    // The original code used numeric indices for params which is weird for standard URL params, 
    // but looking at client code (we assume) it probably sends ?id=X&pwm=Y... or similar.
    // Let's assume standard query params based on standard HTTP usage, 
    // but knowing ESP8266WebServer usually handles name=value.
    
    // However, the ESP code snippet showed:
    // request->getParam(0)->value(); 
    // This implies order matters or they are just iterating. 
    // Let's support named params if the client sends them, or we might need to adjust.
    // Based on `display.hpp` and others, they use `getParam("name")`. 
    // But `waterPump1OnOFF` used `getParam(0)`, `getParam(1)`...
    // Let's log the query to see what comes in.
    
    console.log('GET /waterPump1OnOFF query:', req.query);
    
    // We'll try to guess based on standard keys if they exist, or just log.
    // If the client sends `?id=1&pwm=100&time=10`, we use that.
    
    res.send('OK');
});

app.get('/getClock', (req, res) => {
    const now = new Date();
    // Format: HH:MM:SS DD/MM/YYYY
    const formatted = now.toLocaleString('es-ES', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).replace(',', ''); 
    // Node might give "DD/MM/YYYY, HH:MM:SS" or similar. 
    // Let's force consistency manually to match C++ sprintf(buffer, "%02d:%02d:%02d %02d/%02d/%04d", ...
    
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const D = String(now.getDate()).padStart(2, '0');
    const M = String(now.getMonth() + 1).padStart(2, '0');
    const Y = now.getFullYear();
    
    res.send(`${h}:${m}:${s} ${D}/${M}/${Y}`);
});

app.get('/getTemperature', (req, res) => {
   res.send("25.50"); 
});

// List items
app.get('/getList', (req, res) => {
    // Format: "Day-Hour-Minute/"
    res.send("Lunes-10-30/Martes-12-00/"); 
});

// Add Task
app.get('/addTaskEsp', (req, res) => {
    console.log('GET /addTaskEsp:', req.query);
    res.send('apagado');
});

// Item CRUD
app.get('/item', (req, res) => {
    res.send('Get All or Filtered');
});

app.post('/item', (req, res) => {
    console.log('POST /item', req.body);
    res.send('Create ' + JSON.stringify(req.body));
});

app.put('/item', (req, res) => {
    console.log('PUT /item', req.body);
    res.send('Replace item');
});

app.delete('/item', (req, res) => {
    console.log('DELETE /item', req.query);
    res.send('Delete item');
});

// Control (Display)
app.get('/control', (req, res) => {
    const direction = req.query.direction || 'No direction';
    console.log('Control direction:', direction);
    res.send('the direction is: ' + direction);
});


// Start server
server.listen(port, () => {
    console.log(`Mock server listening on http://localhost:${port}`);
    console.log(`WebSocket server listening on ws://localhost:${port}/ws`);
});
