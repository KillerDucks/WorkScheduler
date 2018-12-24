// Libs
const express = require('express');
const ws = require('ws');

const Structs = require("./structs");
const Config = require("./configs");
const DB = require("./db");

// Configs
const wss = new ws.Server({ port: 8080 });
const app = express();
app.use("/assets", express.static(__dirname + "/views/assets"));

// Globals
const port = 3000;

// Main Entry
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('[WebSocket::Message]\treceived: %s', message);
    });

    let sampleJob = new Structs.Job("WorkScheduler", "Make the App!!!", "10 Weeks", 10, new Structs.Client("KillerDucks", "killerducks@bindserver.com", "sad67as3"));
    let debugMessage = new Structs.WsMessage("Job", false, sampleJob);
    ws.send(JSON.stringify(debugMessage));
});

// FrontEnd Page
app.get('/', (req, res) => {
    console.log(`[Express::/]\tServed / to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`); 
    res.sendFile(__dirname + "/views/index.html");    
});

// Get all Jobs
app.get('/jobs', (req, res) => {
    console.log(`[Express::/]\tServed / to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`); 
    res.sendFile(__dirname + "/views/index.html");    
});

// Get a Job (Using an ID)
app.get('/job/:jobID', (req, res) => {
    console.log(`[Express::/]\tServed / to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`); 
    res.sendFile(__dirname + "/views/index.html");    
});

// Used for JS Debugging
app.get('/debug', (req, res) => {
    console.log(`[Express::/]\tServed /debug to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`); 
    res.sendFile(__dirname + "/views/debugJS.html");    
});

// Listen on Port and Serve Client
app.listen(port, () => {
    console.log(`[Express]\tApp Serving on port: ${port}`);
});