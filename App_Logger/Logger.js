// Structs
const Structs = require("./Structs_Logger");

/**
 *
 * @author Nimesh Patel <nimesh.patel@bindserver.com>
 * @version 1.1.0
 * @class Logger
 */
class Logger { 
    /**
     *Creates an instance of Logger.
     * @param {Object} _storage
     * @param {Number} _timeFormat
     * @memberof Logger
     */
    constructor(_storage = new Structs.StorageClass(3), _ID_Gen, _timeFormat = 0, _appName = "LoggerX", _log_Folder = "LogX"){
        this._storage = _storage;
        this._timeFormat = _timeFormat;
        this._appName = _appName;
        this._ID_Gen = _ID_Gen;
        this._log_Folder = _log_Folder;
        this.LoggerInit();        
    }

    LoggerInit(){
        // Check if the folder exists
        let z = require('fs').readdirSync(`./`).some((folder) => {
            if(folder == this._log_Folder) 
            {
                return true;
            }
        });
        // If the specified folder is not found output to the root dir
        if(!z){
            this._log_Folder = '';
        }
        // Set File name for this session
        this._log_Filename = `${this._appName}-${this._ID_Gen}`;
        // If JSON storage type is set create a writable stream
        if(this._storage._Type == 1){
            this._json_file_writer = require('fs').createWriteStream(`./${this._log_Folder}/${this._log_Filename}.json`, {encoding: 'utf8', flags: 'a', autoClose: true});
            if(this.CheckFileStream())
            {
                this._json_file_writer.write("[\n\t", (error) => {
                    if(error) throw new Error(`[FATAL ERROR] ${data.TimeStamp} [LoggerX_JSON_File_Writer]\t Unable to Write Log into File: ${this._log_Filename}!!\n\t\t\t[FATAL ERROR] [LoggerX] => [Internal System] Module Panic\nQuitting...`);
                });
            }
        }

        this._json_file_writer.on('close', this.HandleStreamClose);
        this._json_file_writer.on('error', this.HandleStreamClose);

        this._isFirstLine = true;

        // Print out the set configuration 
        this.Log({Namespace: "LoggerX_Init", Info: `LoggerX has been setup to use ${this.StorageType[this._storage._Type]} with a Timestamp format of ${this.TimeFormats[this._timeFormat]}${(this._storage._Type == 1 || this._storage._Type == 2) ? `, log files are stored in ${this._log_Folder}` : ``}`});
    }

    Log(data){
        // Format + Add Metadata
        data.TimeUnix = Date.now();
        data.TimeStamp = this.TimeNow();
        data._ID = this._ID_Gen;
        data.AppName = this._appName;

        let currentLog = `${data.TimeStamp} [${this._appName}] => [${data.Namespace}]\t ${data.Info}`;

        switch (this._storage._Type) {
            case 0:       
                // MongoDB
                this._storage._Connection.InsertRow(data, (status) => {
                    if(!status) throw new Error(`[FATAL ERROR] ${data.TimeStamp} [LoggerX_DB]\t Unable to Insert Log into Database!!\n\t\t\t[FATAL ERROR] [LoggerX] => [Internal System] Module Panic\nQuitting...`);
                }, "LoggerX");                
                break;

            case 1:
                // JSON File.
                // Check for JSON file writer
                if(!this.CheckFileStream())
                { 
                    break;
                }
                if(this._isFirstLine)
                {
                    this._json_file_writer.write('\n' + JSON.stringify(data), (error) => {
                        if(error) throw new Error(`[FATAL ERROR] ${data.TimeStamp} [LoggerX_JSON_File_Writer]\t Unable to Write Log into File: ${this._log_Filename}!!\n\t\t\t[FATAL ERROR] [LoggerX] => [Internal System] Module Panic\nQuitting...`);
                    });
                } 
                else 
                {
                    this._json_file_writer.write(',\n' + JSON.stringify(data), (error) => {
                        if(error) throw new Error(`[FATAL ERROR] ${data.TimeStamp} [LoggerX_JSON_File_Writer]\t Unable to Write Log into File: ${this._log_Filename}!!\n\t\t\t[FATAL ERROR] [LoggerX] => [Internal System] Module Panic\nQuitting...`);
                    });
                }

                
                this._isFirstLine = false;
                break;

            case 2:
                // Text File
                require('fs').writeFile(`./${this._log_Folder}/${this._log_Filename}.txt` , currentLog + `\n`, {encoding: 'utf8', flag: 'a'}, (err) => {
                    if(err) throw new Error(`[FATAL ERROR] ${data.TimeStamp} [LoggerX_FileWriter]\t Unable to Write Log into File: ${this._log_Filename}!!\n\t\t\t[FATAL ERROR] [LoggerX] => [Internal System] Module Panic\nQuitting...`);
                });
                break;
        
            default:
                // We should never hit the default statement
                break;
        }
        // Log to the Console (Also Counts as option 3 [ConsoleOnly])
        console.log(currentLog);
    }


    LogX_Close()
    {
        if(this.CheckFileStream)
        {
            this._json_file_writer.write('\n]');
            this._json_file_writer.end();
        }
    }

    HandleStreamClose()
    {
        console.log("Hit")
        // this._json_file_writer.write('\n]');
    }

    /**
     *
     *
     * @returns A Boolean on the state of the writable stream
     * @memberof Logger
     */
    CheckFileStream()
    {
        if(!this._json_file_writer)
        {
            throw new Error(`[FATAL ERROR] ${data.TimeStamp} [LoggerX_JSON_File_Writer]\t There is no File Stream Context!!\n\t\t\t[FATAL ERROR] [LoggerX] => [Internal System] Module Panic\nQuitting...`);
            return false;
        }
        if(!this._json_file_writer.writable){
            throw new Error(`[FATAL ERROR] ${data.TimeStamp} [LoggerX_JSON_File_Writer]\t Unable to Write Log into File: ${this._log_Filename}!!\n\t\t\t[FATAL ERROR] [LoggerX] => [Internal System] Module Panic\nQuitting...`);
            return false;
        }

        return true;
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

process.on('exit', () => {

})

module.exports = Logger;