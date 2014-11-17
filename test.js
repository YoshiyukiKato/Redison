var Redison = require("./Redison.js").init;
var subClient = new Redison();
var pubClient = new Redison();

subClient.subscribe({
    test:{
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we have " + count + " channels");
            pubClient.publish("test",{ message: "これは、Redisonのテストです"});
        },
        message:function(channel,message){
            console.log(message);
            try{
                this.unsubscribe(channel);
            }catch(e){
                console.log(e);   
            }
        },
        unsubscribe:function(channel,count){
            console.log("Unsubscribed " + channel + " :: Now we have " + count + " channels");
            console.log("***Test was successfully ended. Please stop this process by Ctrl-C.***");
        }
    }

});
