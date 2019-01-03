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


// Main Entry

////////////////////// WebSockets //////////////////////
wss.on('connection', function connection(ws) {
    // Incoming Message
    ws.on('message', function incoming(message) {
        // Decode Message
        try {
            let m = JSON.parse(message);
            console.log('[WebSocket::Message]\tReceived Message Type: %s', m.Type);
            switch (m.Type) {
                // Job Related Types
                case "Update_Job":
                    dbConn.UpdateData(m.Payload.Request_ID, m.Payload.UpdateObject);
                    break;
                case "Create_Job":
                    dbConn.InsertData(new Structs.Job(m.Payload.Name, m.Payload.Description, `${m.Payload.TimeSpan} Weeks`, m.Payload.Priority, m.Payload.Client), (status) => {
                        if(!status) ws.send(JSON.stringify(new Structs.WsMessage("Job_Status", false, { Operation: "Insert", Status: "Failed" })));
                        ws.send(JSON.stringify(new Structs.WsMessage("Job_Status", false, { Operation: "Insert", Status: "Success" })));
                    });
                    break;
                case "Delete_Job":
                    dbConn.DeleteData(m.Payload.Request_ID);
                    break;
                case "Get_Job":
                    dbConn.JSONResultSingle(new Structs.DBSearch("_ID", m.Payload.Request_ID), (data) => {
                        ws.send(JSON.stringify(new Structs.WsMessage("Job", false, data)));
                    });  
                    break;
                // Client Related Types
                case "Update_Client":
                    break;
                case "Create_Client":
                    dbConn.InsertData(new Structs.Client(m.Payload.Name, m.Payload.Email), (status) => {
                        if(!status) ws.send(JSON.stringify(new Structs.WsMessage("Job_Status", false, { Operation: "Insert", Status: "Failed" })));
                        ws.send(JSON.stringify(new Structs.WsMessage("Job_Status", false, { Operation: "Insert", Status: "Success" })));
                    });
                    break;
                case "Delete_Client":
                    break;
                case "Get_Client":
                    if(m.Payload.SearchType == "Email"){
                        dbConn.JSONResultSingle(new Structs.DBSearch("Email", m.Payload.Request_Email), (data) => {
                            ws.send(JSON.stringify(new Structs.WsMessage("Client", false, data)));
                        }, "Client");  
                    } else {
                        dbConn.JSONResultSingle(new Structs.DBSearch("_ID", m.Payload.Request_ID), (data) => {
                            ws.send(JSON.stringify(new Structs.WsMessage("Client", false, data)));
                        }, "Client");  
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(`[WebSocket::Error]\tError: ${error}`);
        }
    });


    // Debugging
    // dbConn.JSONResult((data) => {
    //     data.forEach(job => {
    //         let debugMessage = new Structs.WsMessage("Job", false, job);
    //         ws.send(JSON.stringify(debugMessage));     
    //     });
    // });
    console.log("[Debugging}\tWS Client Connected!!");
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
app.listen(Config.Express.Port, () => {
    console.log(`[Express]\tApp Serving on port: ${Config.Express.Port}`);
});