var Redison = require("./lib/redison");

var subClient = Redison.redisonize().initListener();
var pubClient = Redison.redisonize();

subClient.setPsub({
	"ptest*":{
		psubscribe:function(pattern,count){
			console.log("Subscribing pattern " + pattern + " :: Now we have " + count + " channels");	
			pubClient.publish("ptest1",  JSON.stringify({ message: "Single channel test with pattern."}));
		},
		pmessage:function(pattern, channel, message){
			console.log("Message from " + channel + " cought by " + pattern + " : "  + message);
		    subClient.statePunsub(pattern,true);
            console.log("unsub this channel with quit state");
            console.log(subClient.hasPcallback(pattern));
		},
		punsubscribe:function(pattern,count){
			console.log("Unsubscribed pattern " + pattern + " :: Now we have " + count + " channels");
			console.log("***Single channel test with pattern was successfully ended.***");
		}
	},
	"ptes*est":{
		psubscribe:function(pattern,count){
			console.log("Subscribing pattern " + pattern + " :: Now we have " + count + " channels");
			pubClient.publish("ptestptest",  JSON.stringify({ message: "Multi channel test with pattern."}));	
		},
		pmessage:function(pattern, channel, message){
			console.log("Message from " + channel + " cought by " + pattern + " : "  + message);
			subClient.statePunsub(pattern,false);
            console.log("unsub this channel with pause state");
            console.log(subClient.hasPcallback(pattern));
		},
		punsubscribe:function(pattern,count){
			console.log("Unsubscribed pattern " + pattern + " :: Now we have " + count + " channels");
			console.log("***Multi channel test with pattern was successfully ended. Please stop this process by Ctrl-C.***");
		}
	}
});

try{
    subClient.setPsub();
}catch(e){
    console.log( e +" :: This error is intentionally occured. No problem.");
}