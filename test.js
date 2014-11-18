var Redison = require("./Redison.js");

var subClient = Redison.redisonize().initSub();
var pubClient = Redison.redisonize();

subClient.setSub({
    test1:{
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we have " + count + " channels");
            pubClient.publish("test1", "test1::" + JSON.stringify({ message: "Single channel test."}));
        },
        message:function(channel,message){
            console.log(message);
            subClient.unsubscribe(channel);
        },
        unsubscribe:function(channel,count){
            console.log("Unsubscribed " + channel + " :: Now we have " + count + " channels");
            console.log("***Single channel test was successfully ended.***");
        }
    },
    test2:{
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we have " + count + " channels");
            pubClient.publish("test2", "test2::" + JSON.stringify({ message: "Multi channel test."}));
        },
        message:function(channel,message){
            console.log(message);
            subClient.unsubscribe(channel);
        },
        unsubscribe:function(channel,count){
            console.log("Unsubscribed " + channel + " :: Now we have " + count + " channels");
            console.log("***Multi channel test was successfully ended. Please stop this process by Ctrl-C.***");
        }
    }

});
