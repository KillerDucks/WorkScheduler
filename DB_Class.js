const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

class DB {
    constructor(url, database, collection){
        this.url = `mongodb://${url}:27017`;
        this.dbName = database;
        this.collection = collection;
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
                        console.log(doc);
                        if(doc._ID == singleQuery){                            
                            console.log(`[MongoDB::Retrieval]\tFound Data with ID =>${doc._ID}`);
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

    InsertData(dataObject, override = false){
        // Localize this
        let dbName = this.dbName;
        let dbCollection = this.collection;

        MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            console.log("[MongoDB::Insert]\tConnected successfully to server");
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
            });
            console.log(`[MongoDB::Insert]\tDone Inserting Data with ID => ${dataObject._ID}`);
            client.close();
        });
    }
}

module.exports = DB;