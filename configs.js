module.exports = {
    Express: {
        Port: "3000",
    },
    
    MongoDB: {
        Host: "localhost"
    },

    MongoDB_Docker: {
        Host: "172.17.153.138"
    },

    API: {
        // Used for Job settings bots
        BotUserNames: ["bot_fb", "bot_twit", "bot_disco", "bot_git"],
        // Do bots need access tokens?
        NeedAccessToken: false,
        // Quick way of making tokens (Change to users preference)
        GenToken: function(){
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
    },

    Debugging: {
        Enabled: true,
        Env: false
    }
}