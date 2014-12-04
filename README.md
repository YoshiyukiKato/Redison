#About
Redis subscribe event mapper

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
Redison provides simple method for setting callbacks for events of Redis subscriber by hashmap.

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
You can use Redison client same as node_redis client.
  
In case of setting detail prameter of redis connection in node_redis client, you can decorate the node_redis client by ```redisonize``` method.

```js:decorate
var node_redis = require("redis"),
    nrClient = redis.createClient(port, host, options);
    
var redisonClient = require("redison").redisonize(nrClient);
```

##Subscribe with Event Map

Setting callbacks of redis subscriber events for every channel/pattern by hashmap.
First, please call ```initListener``` for initialize client as subscriber.

```js:invoke
var Redison = require("redison"),
    client = Redison.redisonize().initListener();
```
This activates event listeners of all redis subscriber events: ```subscribe```, ```message```, ```unsubscribe```, ```psubscribe```, ```pmessage```, ```punsubscribe```.  
If you want to listen specific event, please call ```initListener``` with desired event names as arguments.

```js:invoke
client = redison.redisonize().initListener("subscribe","message");
```

###Common subscriber

Starting a redis subscriber with callbacks you setted in ```subMap```.

```js:invoke
client.setSub(subMap);
```

The ```subMap``` is written as follows:

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



###Pattern subscriber

Starting a redis pattern subscriber with callbacks you setted in ```psubMap```.

```js:invoke
client.setPsub(psubMap);
```

The ```psubMap``` is written as follows:

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

##Unsubscribe with State
Unsubscribing a specific channel/pattern with a state.
The state allows you to choose whether delete callback setted by Event Map or not.
```stateUnsub```/```statePunsub``` method provides two kinds of unsubscription: **quit** and **pause**.
The **quit** deletes callback, the **pause** do not.

```js
client.stateUnsub(channel,quitState);
```

###Unsubscribe/Punsubscribe as Quit

```js
client.stateUnsub(channel,true);
```

```js
client.statePunsub(pattern,true);
```

###Unsubscribe/Punsubscribe as Pause

```js
client.stateUnsub(channel,false);
```

```js
client.statePunsub(pattern,false);
```

##LICENSE
MIT
