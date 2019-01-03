// Structs
const Structs = require("./Structs_Logger");

class Logger { 
    /**
     *Creates an instance of Logger.
     * @param {Object} _storage
     * @param {Number} _timeFormat
     * @memberof Logger
     */
    constructor(_storage = new Structs.StorageClass(3), _ID_Gen, _timeFormat = 0, _appName = "LoggerX"){
        this._storage = _storage;
        this._timeFormat = _timeFormat;
        this._appName = _appName;
        this._ID_Gen = _ID_Gen;
        this.LoggerInit();        
    }

    LoggerInit(){
        // console.log(`${this.TimeNow()} [LoggerX::Init]\t LoggerX has been setup to use ${this.StorageType[this._storage._Type]} with a Timestamp format of ${this.TimeFormats[this._timeFormat]}`);
        this.Log({Namespace: "LoggerX_Init", Info: `LoggerX has been setup to use ${this.StorageType[this._storage._Type]} with a Timestamp format of ${this.TimeFormats[this._timeFormat]}`});
    }

    Log(data){
        // Format + Add Metadata
        data.TimeUnix = Date.now();
        data.TimeStamp = this.TimeNow();
        data._ID = this._ID_Gen;
        data.AppName = this._appName;

        switch (this._storage._Type) {
            case 0:                
                this._storage._Connection.InsertData(data, (status) => {
                    if(!status) throw new Error((`[LoggerX_DB]\t Unable to Insert Log into Database!!`));
                } ,"LoggerX");                
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                // console.log(`[${this._appName}::${data.Namespace}]\t ${data.Info}`);
                break;
        
            default:
                break;
        }
        // Log to the Console
        console.log(`${this.TimeNow()} [${data.Namespace}]\t ${data.Info}`);
    }

    /**
     *
     *
     * @returns A Timestamp in the predefined formats
     * @memberof Logger
     */
    TimeNow(){
        if(this._timeFormat != 0) { return Date.now(); };
        return `[${new Date().toLocaleString()}]`;
    }

    /**
     *
     *
     * @static
     * @returns {Number} Integer Value of Storage Type
     * @memberof Logger
     */
    static StorageType(){
        return Object.freeze({"MongoDB": 0, "Json_File": 1, "Text_File": 2, "ConsoleOnly": 3});
    }

    static TimeFormats(){
        return Object.freeze({"Vanilla": 0, "Unix": 1});
    }

    get StorageType(){
        return Object.freeze({0: "MongoDB", 1: "Json_File", 2: "Text_File", 3: "ConsoleOnly"});
    }

    get TimeFormats(){
        return Object.freeze({0: "Vanilla", 1: "Unix"});
    }
};

module.exports = Logger;