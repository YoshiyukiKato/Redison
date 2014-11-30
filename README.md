#About
Redis subscriber event mapper for node-redis.

#Dependencies

* redis

#Setup and Test

##Clone from Github
```sh:terminal
$ git clone git@github.com:YoshiyukiKato/Redison.git
$ cd Redison && npm install
$ node test.js
```

##Get from npm
```sh:terminal
$ npm install redison
$ node node_modules/redison/test.js
```

#Usage

##Overview

```js:usage
var Redison = require("redison"),
    client = Redison.redisonize().initListener();

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

Redison extends [node_redis](https://github.com/mranney/node_redis) without overriding any method.  
So, you can use Redison client same as node_redis client.
   
##Event Map

You can set callbacks of redis subscriber events for every channel by hashmap.
First, please call ```initListener``` for initialize client as subscriber.

```js:invoke
var Redison = require("/path/to/Redison.js"),
    client = Redison.redisonize().initListener();
```

###Common subscriber
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

 And then, invoke ```setSub``` with using ```subMap``` as an argument.

```js:invoke
client.setSub(subMap);
```

It starts a redis subscriber with callbacks you setted.

###Pattern subscriber
```js:map
var psubMap = {
    //channels pattern
    "pattern*":{
        //event:callback
        subscribe:function(channel,count){
            console.log("Subscribing " + channel + " :: Now we subscribe " + count + " channels");
        },
        message:function(pattern,channel,message){
            console.log(pattern + " :: " + channel + " :: " +message);
        },
        unsubscribe:function(channel,count){
            console.log("Unsubscribing " + channel + " :: Now we subscribe " + count + " channels");
        }
    },
    "pat*ern":{
        subscribe:function(channel,count){
            console.log("callback");
        },
        message:function(pattern,channel,message){
            console.log("I got a message from" + channel + "caught by" + pattern + ":: " + message);
        },
        unsubscribe:function(channel, count){
            console.log("See you " + channel);
        }
    }
}
```

And then, invoke ```setPsub``` with using ```psubMap``` as an argument.

```js:invoke
client.setPsub(psubMap);
```

It starts a redis pattern subscriber with callbacks you setted.

##Unsubscribe with State

* client.stateUnsub(channel,unsubState)
* client.statePunsub(pattern,punsubState)

##LICENSE
MIT
