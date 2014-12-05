var Redison = require("./lib/redison");

var subClient = Redison.redisonize().startListener();
var pubClient = Redison.redisonize();

subClient.setSub({
    test1:{
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we have " + count + " channels");
            pubClient.publish("test1", "test1::" + JSON.stringify({ message: "Single channel test."}));
        },
        message:function(channel,message){
            console.log("Message from " + channel + " : "  + message);
            subClient.stateUnsub(channel,false);
            console.log("unsub this channel with pause state");
            console.log(subClient.hasCallback(channel));
        },
        unsubscribe:function(channel,count){
            console.log("Unsubscribed " + channel + " :: Now we have " + count + " channels");
            console.log("***Single channel test was successfully ended.***");
        },

    },
    test2:{
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we have " + count + " channels");
            pubClient.publish("test2", "test2::" + JSON.stringify({ message: "Multi channel test."}));
        },
        message:function(channel,message){
            console.log("Message from " + channel + " : "  + message);
            subClient.stateUnsub(channel,true);
            console.log("unsub this channel with quit state");
            console.log(subClient.hasCallback(channel));
        },
        unsubscribe:function(channel,count){
            console.log("Unsubscribed " + channel + " :: Now we have " + count + " channels");
            console.log("***Multi channel test was successfully ended.***");
        }
    }
});


try{
    subClient.setSub();
}catch(e){
    console.log( e +" :: This error is intentionally occured. No problem.");
}
