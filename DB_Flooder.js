// DB + Structs
const Structs = require("./structs");
const Config = require("./configs");

// Word Array
const rWords = [
    "fasten",
    "jazzy",
    "contain",
    "obese",
    "fearless",
    "muddle",
    "nonchalant",
    "save",
    "symptomatic",
    "effect",
    "run",
    "nippy",
    "day",
    "legal",
    "unknown",
    "open",
    "friendly",
    "volcano",
    "deeply",
    "massive",
    "business",
    "screw",
    "hospital",
    "flame",
    "unequal",
    "ugly",
    "command",
    "cross",
    "smoke",
    "fang",
    "rub",
    "work",
    "self",
    "thaw",
    "observation",
    "troubled",
    "pin",
    "airport",
    "bait",
    "adamant",
    "eggnog",
    "soda",
    "representative",
    "stale",
    "force",
    "curly",
    "scintillating",
    "light",
    "lovely",
    "nutritious",
    "territory",
    "stroke",
    "omniscient",
    "stew",
    "enthusiastic",
    "eye",
    "bawdy",
    "language",
    "recess",
    "count"
];

class DB_Flood {
    constructor(dbInstance)
    {
        this.db_con = dbInstance;
    }

    FloodDB(usrDefined = 20)
    {
        // Flooder
        let rInt = randomIntFromInterval(1, usrDefined);
        for (let index = 0; index < rInt; index++) {
            let client = new Structs.Client("Killer" + randomWorkFromArray(), "SampleDuck@bindserver.com");
            let sampleJob = new Structs.Job("WorkScheduler_DB_FLOODER", `${randomWorkFromArray()} ${randomWorkFromArray()} ${randomWorkFromArray()}!!`, `${randomIntFromInterval(1, 20)} Weeks`, randomIntFromInterval(1, 10), client);
            this.db_con.InsertData(sampleJob);
            this.db_con.InsertData(client, "Clients");
        }
    }
};

// Helpers
function randomIntFromInterval(min = 1,max = 10) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randomWorkFromArray()
{
    return rWords[randomIntFromInterval(0, 59)];;
}

// exports
module.exports = DB_Flood;