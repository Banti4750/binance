"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const ws_2 = __importDefault(require("ws"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const wss = new ws_1.WebSocketServer({ port: 8080 });
// Store for latest prices and changes
const priceStore = {};
// Binance WebSocket URL for 24h ticker data
const binanceWS = new ws_2.default("wss://stream.binance.com:9443/ws/!ticker@arr");
binanceWS.onmessage = (event) => {
    //@ts-ignore
    const tickers = JSON.parse(event.data);
    // Filter and process only the coins we're interested in
    const relevantSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT'];
    //@ts-ignore
    tickers.forEach(ticker => {
        if (relevantSymbols.includes(ticker.s)) {
            const symbol = ticker.s;
            //@ts-ignore
            priceStore[symbol] = {
                price: parseFloat(ticker.c).toFixed(2), // Current price
                change: parseFloat(ticker.P).toFixed(2) // 24h price change percentage
            };
        }
    });
    // Broadcast updates to all connected clients
    wss.clients.forEach(client => {
        if (client.readyState === ws_2.default.OPEN) {
            client.send(JSON.stringify(priceStore));
        }
    });
};
// Handle WebSocket connection errors
binanceWS.onerror = (error) => {
    console.error('WebSocket error:', error);
};
// Handle WebSocket disconnection
binanceWS.onclose = () => {
    console.log('Binance WebSocket connection closed');
    // Attempt to reconnect after a delay
    setTimeout(() => {
        console.log('Attempting to reconnect to Binance...');
        //@ts-ignore
        binanceWS = new ws_2.default("wss://stream.binance.com:9443/ws/!ticker@arr");
    }, 5000);
};
// WebSocket server connection handling
wss.on('connection', (ws) => {
    console.log('Client connected');
    // Send initial data to newly connected client
    if (Object.keys(priceStore).length > 0) {
        ws.send(JSON.stringify(priceStore));
    }
    ws.on('error', console.error);
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
// Express server routes
app.get("/", (req, res) => {
    res.send("WebSocket Crypto Price Server Running");
});
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: 'healthy',
        connections: wss.clients.size,
        trackedSymbols: Object.keys(priceStore)
    });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});
