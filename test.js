var AsynClient = require("./AsynClient.js").init;
var subClient = new AsynClient("toJava","fromJava");
var pubClient = new AsynClient("toJava","fromJava");

subClient.redisSubscribe({
    subscribe:function(channel,count){
        console.log("Subscribing " + channel + " :: Now we have " + count + " channels");
        pubClient.redisPublish("test","これは、Node.jsからKuromojiを使うテストです。");
    },
    message:function(channel,message){
        console.log(message);
        //unsubscribe "fromJava" channel
        subClient.redisClient.unsubscribe("fromJava");
    },
    unsubscribe:function(channel,count){
        console.log("Unsubscribed " + channel + " :: Now we have " + count + " channels");
        console.log("***Test was successfully ended. Please stop this process by Ctrl-C.***");
    }
});
