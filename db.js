const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

class DB {
    constructor(url, database, collection){
        this.url = `mongodb://${url}:27017`;
        this.dbName = database;
        this.collection = collection;
    }

    get Data() {
        // Localize this
        let dbName = this.dbName;
        let dbCollection = this.collection;

        MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
        
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
    };

    get DatabaseName(){
        return this.dbName;
    }

    get DatabaseCollection(){
        return this.dbName;
    }

    InsertData(dataObject){
        // Localize this
        let dbName = this.dbName;
        let dbCollection = this.collection;

        MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            console.log(dbName);
            const db = client.db(dbName);
            // Get the documents collection
            const collection = db.collection(dbCollection);

            collection.insertOne(dataObject, (err, res) => {
                if(err) throw err;
                // console.log(res);    Debug Print
            });
            console.log("Done");
            client.close();
        });
    }
}

module.exports = DB;