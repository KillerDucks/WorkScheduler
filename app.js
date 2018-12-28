// Libs
const express = require('express');
const ws = require('ws');

const Structs = require("./structs");
const Config = require("./configs");
const DB = require("./DB_Class");

// Configs
const wss = new ws.Server({ port: 8080 });
const app = express();
app.use("/assets", express.static(__dirname + "/views/assets"));
const dbConn = new DB("localhost", "WorkScheduler", "Jobs");

// Globals
const port = 3000;

// Main Entry
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('[WebSocket::Message]\treceived: %s', message);
    });

    // Debugging
    dbConn.JSONResult((data) => {
        data.forEach(job => {
            let debugMessage = new Structs.WsMessage("Job", false, job);
            ws.send(JSON.stringify(debugMessage));     
        });
    });
});

////////////////////// FrontEnd Routes //////////////////////

// FrontEnd Page
app.get('/', (req, res) => {
    console.log(`[Express::/]\tServed / to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`); 
    res.sendFile(__dirname + "/views/index.html");    
});

// Used for JS Debugging
app.get('/debug', (req, res) => {
    console.log(`[Express::/]\tServed /debug to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`); 
    res.sendFile(__dirname + "/views/debugJS.html");    
});

////////////////////// API Routes //////////////////////

// Get all Jobs
app.get('/jobs', (req, res) => {
    console.log(`[Express::/]\tServed /jobs to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`);
    dbConn.JSONResult((data) => {
        res.status(200).json(data);
    });    
});

// Get a Job (Using an ID)
app.get('/job/:jobID', (req, res) => {
    console.log(`[Express::/]\tServed /job/:jobID to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`); 
    dbConn.JSONResultSingle(req.params.jobID, (data) => {
        res.status(200).json(data);
    });  
});

// Get all Clients
app.get('/clients', (req, res) => {
    console.log(`[Express::/]\tServed /clients to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`);
    dbConn.JSONResult((data) => {
        res.status(200).json(data);
    }, "Clients");    
});

// Get a Client (Using an ID)
app.get('/client/:clientID', (req, res) => {
    console.log(`[Express::/]\tServed /client/clientID to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`); 
    dbConn.JSONResultSingle(req.params.clientID, (data) => {
        res.status(200).json(data);
    }, "Clients");  
});

////////////////////// Express Listen //////////////////////

// Listen on Port and Serve Client
app.listen(port, () => {
    console.log(`[Express]\tApp Serving on port: ${port}`);
});