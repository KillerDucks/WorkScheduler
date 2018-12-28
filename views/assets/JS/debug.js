$(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = (e) => {
        ws.send("Connection Established")
    }
    ws.onmessage = (e) => {
        // console.log(e); // Debug Print
        // Test if incoming data is a object (lets just assume it is an object because im lazy :])

        // Decode the message
        let m = JSON.parse(e.data);

        console.log(m); // Debug Print

        switch (m.Type) {
            case "Debug":
                console.log("Debug Message Received");
                break;

            case "Job":
                console.log("Job Object Received");
                // Get data from the Message Payload
                if(true){
                    console.log(m.Payload);
                    // Change HTML
                    $(".dataArea").append(`<div class="panel panel-info"><div class="panel-heading"><h3 class="panel-title job_name">${m.Payload.Name}</h3></div><div class="panel-body job_data">Description: ${m.Payload.Description}<br/>TimeSpan: ${m.Payload.TimeSpan}</div></div>`);
                    // $(".job_name").text(m.Payload.Name);
                    // $(".job_data").html(`Description: ${m.Payload.Description}<br/>TimeSpan: ${m.Payload.TimeSpan}`);
                }
                // } else {
                //     console.log("Invalid Job Object");
                // }
                break;
        
            default:
                console.log("Invalid Message Received");
                break;
        }
    };
});