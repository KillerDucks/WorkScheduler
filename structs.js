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
        this.Name = Name;
        this.Created_Time = Date.now();
        this.Priority = Priority;
        this.Description = Description;
        this.TimeSpan = TimeSpan;
        this.Client = Client;
    }
}

class Client {
    constructor(Name, Email, Id){
        this.Name = Name;
        this.Email = Email;
        this.Id = Id;
    }
}

module.exports = { Client, Job, WsMessage };