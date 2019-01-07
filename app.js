// Libs
const express = require('express');
const ws = require('ws');

const Structs = require("./structs");
const Config = require("./configs");
const DB = require("./DB_Class");

const Logger = require("./App_Logger/Logger");

// Configs
const wss = new ws.Server({ port: 8080 });
const app = express();
app.use("/assets", express.static(__dirname + "/views/assets"));
const LoggerX = new Logger({_Type: Logger.StorageType().MongoDB, _Connection: new DB((Config.Debugging.Env) ? Config.MongoDB_Docker.Host : Config.MongoDB.Host, "WorkScheduler", "Jobs", true)}, Config.API.GenToken());
const dbConn = new DB((Config.Debugging.Env) ? Config.MongoDB_Docker.Host : Config.MongoDB.Host, "WorkScheduler", "Jobs", false, LoggerX);

// Globals


// Main Entry

////////////////////// WebSockets //////////////////////
wss.on('connection', function connection(ws, req) {
    // Incoming Message
    ws.on('message', function incoming(message) {
        // Decode Message
        try {
            let m = JSON.parse(message);
            // console.log('[WebSocket::Message]\tReceived Message Type: %s', m.Type);
            LoggerX.Log({Namespace: "WebSocket_Message", Info: `Received Message Type: ${m.Type}`});
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
            LoggerX.Log({Namespace: "WebSocket_Error", Info: `Error Thrown: ${error}`});
        }
    });


    // Debugging
    // dbConn.JSONResult((data) => {
    //     data.forEach(job => {
    //         let debugMessage = new Structs.WsMessage("Job", false, job);
    //         ws.send(JSON.stringify(debugMessage));     
    //     });
    // });

    LoggerX.Log({Namespace: "WebSocket_Connection", Info: `Client Connected [IP] => ${req.socket.remoteAddress}`});
});

////////////////////// FrontEnd Routes //////////////////////

// FrontEnd Page
app.get('/', (req, res) => {
    LoggerX.Log({Namespace: "Express_Route", Info: `Served / to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`});
    res.sendFile(__dirname + "/views/index.html");    
});

// Used for JS Debugging
app.get('/debug', (req, res) => {
    LoggerX.Log({Namespace: "Express_Route", Info: `Served /debug to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`});
    res.sendFile(__dirname + "/views/debugJS.html");    
});

////////////////////// API Routes //////////////////////

// Get all Jobs
app.get('/jobs', (req, res) => {
    LoggerX.Log({Namespace: "Express_Route", Info: `Served [API] /jobs to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`});    
    dbConn.JSONResult((data) => {
        res.status(200).json(data);
    });    
});

// Get a Job (Using an ID)
app.get('/job/:jobID', (req, res) => {
    LoggerX.Log({Namespace: "Express_Route", Info: `Served [API] /job/:jobID to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`});
    dbConn.JSONResultSingle({_ID: req.params.jobID}, (data) => {
        res.status(200).json(data);
    });  
});

// Get all Clients
app.get('/clients', (req, res) => {
    LoggerX.Log({Namespace: "Express_Route", Info: `Served [API] /clients to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`});
    dbConn.JSONResult((data) => {
        res.status(200).json(data);
    }, "Clients");    
});

// Get a Client (Using an ID)
app.get('/client/:clientID', (req, res) => {
    LoggerX.Log({Namespace: "Express_Route", Info: `Served [API] /client/:clientID to: [${req.connection.remoteFamily}] ${req.connection.remoteAddress}:${req.connection.remotePort}`});
    dbConn.JSONResultSingle({_ID: req.params.clientID}, (data) => {
        res.status(200).json(data);
    }, "Clients");  
});

////////////////////// Express Listen //////////////////////

// Listen on Port and Serve Client
app.listen(Config.Express.Port, () => {
    LoggerX.Log({Namespace: "Express_Server", Info: `App Serving on port: ${Config.Express.Port}`});
});