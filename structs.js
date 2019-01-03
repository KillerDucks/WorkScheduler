class WsMessage {
    constructor(type, Encrypted, Payload){
        this.Type = type;
        this.Timestamp = Date.now();
        this.Encrypted = Encrypted;
        this.Payload = Payload;
    }
}

class Job {
    constructor(Name, Description, TimeSpan, Priority, Client){
        this._ID = GenToken();
        this.Name = Name;
        this.Created_Time = Date.now();
        this.Priority = Priority;
        this.Description = Description;
        this.TimeSpan = TimeSpan;
        this.Client = Client;
    }
}

class Client {
    constructor(Name, Email){
        this._ID = GenToken();
        this.Name = Name;
        this.Email = Email;
    }
}

class DBSearch {
    constructor(Key, Value){
        this.Key = Key;
        this.Value = Value;
    }
}

module.exports = { Client, Job, WsMessage, DBSearch };

// Helper
function GenToken(){
    var result, i, j;
    result = '';
    for(j=0; j<32; j++) {
        if( j == 8 || j == 12 || j == 16 || j == 20) 
        result = result;
        i = Math.floor(Math.random()*16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}