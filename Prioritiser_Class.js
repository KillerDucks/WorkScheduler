class Prioritiser {
    constructor() {

    }

    // // Sorters
    // SortByTime() // Sorts jobs by Timespan
    // SortByPriority() // Sorts jobs by priority

    // // Fulfilment Checkers
    // OversubscribedChecker() // Checks if there are too many jobs of high importance, these jobs cant be fulfilled [Returns: Boolean]
    // SpeedChecker() // Checks if an active job can be fulfilled with the current pace of job completions [Returns: Boolean]

    // // Job feasibility Checkers
    // CheckFeasibility() // Checks a pending job against active jobs to see if we can accept the job [Returns: Boolean]

    // Helpers
    // Gets specific units of time (Weeks, Days, Hours, Minutes) of when the job was created [Returns: Array<String>]
    _GetTimeElapsed(_arrayIN)
    {
        // Divide the Hours into days
        let daysH = _arrayIN[0] / 24;
        let daysM = _arrayIN[1] / 24;
        let daysT = daysH + daysM;

        // 
    }

    // Just splits a string into an Array [Returns: Array<String>] ** Debugging Only
    GetSplitTime(dateInput)
    {
        return new Date(dateInput).toTimeString().split(" ")[0].split(":");
    }

    // Compares 2 Unix timestamp and returns a human readable time format [Returns: Array<String>]
    UnixTimeCompare(t1, t2) 
    {
        // return GetTimeElapsed(GetSplitTime(new Date(t2 - t1)));
        
        let res = Math.abs(t1 - t2) / 1000;
         
        // get total days between two dates
        let days = Math.floor(res / 86400);                              
        // get hours        
        let hours = Math.floor(res / 3600) % 24;                
        // get minutes
        let minutes = Math.floor(res / 60) % 60;    
        // get seconds
        let seconds = res % 60;


        return `Days: ${days}, Hours: ${hours}, Minutes: ${minutes}, Seconds: ${seconds}`;
    }
}

module.exports = Prioritiser;