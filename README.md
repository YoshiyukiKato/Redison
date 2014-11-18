#About
Channel driven Redis subscriber event mapper for node-redis.

#Dependencies

* redis

#Setup and Test

```sh:terminal
$ npm install
$ node test.js
```

#Usage

##Overview

```js:usage
var Redison = require("/path/to/Redison.js"),
    client = Redison.redisonize();

client.setSub({
    subChannel1:{
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we subscribe " + count + " channels");
        },
        message:function(channel,message){
            console.log(message);
        }
    }
});

```

Redison extends [node_redis](https://github.com/mranney/node_redis) without overriding any method. So, you can use Redison client same as node-redis client.  
  
If you already extend node-redis by yourself, Redison can be used as decorator by ```Redison.redisonize(yourRedisClient)```.
But, please be careful to use this command as decorator, because Redison may override yourown method or yourown method does not allow Redison to override the method when you use ```initSub```,```setSub```, ```subSetting```, and ```cbInterface```.

##Channel-driven Event Map

You can set callbacks of redis subscriber events for every channel by hashmap.

```js:map
var subMap = {
    //channels name
    subChannel1:{
        //event:callback
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we subscribe " + count + " channels");
        },
        message:function(channel,message){
            console.log(message);
        },
        unsubscribe:function(channel,count){
            console.log("Unsubscribing " + channel + " :: Now we subscribe " + count + " channels");
        }
    },
    subChannel2:{
        subscribe:function(channel,count){
            console.log("callback");
        },
        message:function(channel,message){
            console.log("I got a message :: " + message);
        },
        unsubscribe:function(channel, count){
            console.log("See you " + channel);
        }
    }
}
```

And invoke ```setSub``` with using ```subMap``` as an argument.

```js:invoke
var Redison = require("/path/to/Redison.js"),
    client = Redison.redisonize().initSub();
    
client.setSub(subMap);
```

It starts a redis subscriber with callbacks you setted.

##LICENSE
MIT
