var Redison = require("./ProtoRedison.js").init;

var subClient = Redison();
var pubClient = Redison();

subClient.subSetter({
    test:{
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we have " + count + " channels");
            pubClient.publish("test", JSON.stringify({ message: "これは、Redisonのテストです"}));
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