var Redison = require("./Redison.js");

var subClient = Redison.redisonize();
var pubClient = Redison.redisonize();

subClient.subSetter({
    test1:{
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we have " + count + " channels");
            pubClient.publish("test1","test1::" + JSON.stringify({ message: "これは、Redisonのテストです"}));
        },
        message:function(channel,message){
            console.log(message);
            try{
                //subClient.unsubscribe(channel);
            }catch(e){
                console.log(e);   
            }
        },
        unsubscribe:function(channel,count){
            console.log("Unsubscribed " + channel + " :: Now we have " + count + " channels");
            console.log("***Test was successfully ended. Please stop this process by Ctrl-C.***");
        }
    }/*,
    test2:{
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we have " + count + " channels");
            pubClient.publish("test2", "test2::" + JSON.stringify({ message: "これは、Redisonでイベント毎に処理を振り分けるテストです"}));
        },
        message:function(channel,message){
            console.log(message);
            try{
                subClient.unsubscribe(channel);
            }catch(e){
                console.log(e);   
            }
        },
        unsubscribe:function(channel,count){
            console.log("Unsubscribed " + channel + " :: Now we have " + count + " channels");
            console.log("***Test was successfully ended. Please stop this process by Ctrl-C.***");
        }
    }*/

});
