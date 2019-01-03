const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

class DB {
    constructor(url, database, collection, Quiet = false ,LoggerX = false){
        this.url = `mongodb://${url}:27017`;
        this.dbName = database;
        this.collection = collection;
        this.Quiet = Quiet;
        this.LoggerX = LoggerX;
        this.Log = undefined;
        if(this.LoggerX == false){
            if(!this.Quiet) { this.Log = function(data) { console.log(`[${data.Namespace}]\t ${data.Info}`) } } else { this.Log = function(data) { /** Do Nothing */ } }
        } else {
            let LoggerX = this.LoggerX;
            this.Log = function(data){ LoggerX.Log(data) }
        }
    }

    JSONResult(data, override = false)
    {
        // Localize this
        let dbName = this.dbName;
        let dbCollection = this.collection;

        MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            console.log("[MongoDB::Retrieval]\tConnected successfully to server");

            const db = client.db(dbName);

            // Get the documents collection
            let collection;
            if(override){
                collection = db.collection(override);
            } else {
                collection = db.collection(dbCollection);
            }

            collection.find({}).toArray(function(err, docs) {
                assert.equal(err, null);   
                console.log(`[MongoDB::Retrieval]\tReturning Found Data`);   
                data(docs);
                client.close();
            });            
        });
    }

    JSONResultSingle(singleQuery, data, override = false)
    {
        // Localize this
        let dbName = this.dbName;
        let dbCollection = this.collection;

        MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            console.log("[MongoDB::Retrieval]\tConnected successfully to server");

            const db = client.db(dbName);
            
            // Get the documents collection
            let collection;
            if(override){
                collection = db.collection(override);
            } else {
                collection = db.collection(dbCollection);
            }

            collection.find({}).toArray(function(err, docs) {
                assert.equal(err, null);      
                if(singleQuery != ""){
                    docs.forEach((doc) => {
                        if(doc[singleQuery.Key] == singleQuery.Value){                            
                            console.log(`[MongoDB::Retrieval]\tFound Data with ID => ${doc._ID}`);
                            data(doc);
                            return;
                        }                
                    });
                } else {
                    data("EMPTY");
                }
                client.close();
            });            
        });
    }

    get PrintData() 
    {
        // Localize this
        let dbName = this.dbName;
        let dbCollection = this.collection;

        MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            console.log("[MongoDB::Retrieval]\tConnected successfully to server");
        
            const db = client.db(dbName);
            // Get the documents collection
            const collection = db.collection(dbCollection);

            collection.find({}).toArray(function(err, docs) {
                assert.equal(err, null);      
                docs.forEach(doc => {
                    console.log(doc);
                }); 
                client.close();
            });            
        });
    }

    get DatabaseName(){
        return this.dbName;
    }

    get DatabaseCollection(){
        return this.collection;
    }

    get DatabaseURL(){
        return this.url;
    }

    InsertData(dataObject, callback, override = false){
        // Localize this
        let dbName = this.dbName;
        let dbCollection = this.collection;
        let Log = this.Log;        

        MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            // console.log("[MongoDB::Insert]\tConnected successfully to server");
            Log({Namespace: "MongoDB_Insert", Info: "Connected successfully to server"});
            const db = client.db(dbName);
            
            // Get the documents collection
            let collection;
            if(override){
                collection = db.collection(override);
            } else {
                collection = db.collection(dbCollection);
            }

            collection.insertOne(dataObject, (err, res) => {
                if(err) throw err;
                // console.log(res);    Debug Print
                if(res.insertedCount != 1) console.log(`[MongoDB::Insert]\tFailed Inserting Data with ID => ${dataObject._ID}`);
                // console.log(`[MongoDB::Insert]\tDone Inserting Data with ID => ${dataObject._ID}\n\t\t\tMongo ID => ${res.insertedId}`);
                Log({Namespace: "MongoDB_Insert", Info: `Done Inserting Data with ID => ${dataObject._ID}\n\t\t\tMongo ID => ${res.insertedId}`});
                callback(res.insertedCount);
            });
            
            client.close();
        });
    }

    UpdateData(dataID, updateObject, override = false){
        // Localize this
        let dbName = this.dbName;
        let dbCollection = this.collection;

        MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            console.log("[MongoDB::Update]\tConnected successfully to server");
            const db = client.db(dbName);
            
            // Get the documents collection
            let collection;
            if(override){
                collection = db.collection(override);
            } else {
                collection = db.collection(dbCollection);
            }

            collection.updateOne({_ID: dataID}, {$set: updateObject, $set: {Updated: Date.now()}}, (err, res) => {
                if(err) throw err;
                // console.log(res.deletedCount);    //Debug Print
                if(res.modifiedCount == 1){
                    console.log(`[MongoDB::Update]\tDone Updating Data with ID => ${dataID}`);
                } else {
                    console.log(`[MongoDB::Update]\tFailed to Update Data with ID => ${dataID}`);
                }
            });

            client.close();
        });
    }

    DeleteData(dataID, override = false){
        // Localize this
        let dbName = this.dbName;
        let dbCollection = this.collection;

        MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            console.log("[MongoDB::Delete]\tConnected successfully to server");
            const db = client.db(dbName);
            
            // Get the documents collection
            let collection;
            if(override){
                collection = db.collection(override);
            } else {
                collection = db.collection(dbCollection);
            }

            collection.deleteOne({_ID: dataID}, (err, res) => {
                if(err) throw err;
                // console.log(res.deletedCount);    //Debug Print
                if(res.deletedCount == 1){
                    console.log(`[MongoDB::Delete]\tDone Deleting Data with ID => ${dataID}`);
                } else {
                    console.log(`[MongoDB::Delete]\tFailed to Delete Data with ID => ${dataID}`);
                }
            });

            client.close();
        });
    }
}

module.exports = DB;