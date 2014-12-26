#About
[![npm version](https://badge.fury.io/js/redison.svg)](http://badge.fury.io/js/redison)

Redis subscribe event mapper

#Dependencies

* redis

#Install

##From Github
```sh:terminal
$ git clone git@github.com:YoshiyukiKato/Redison.git
$ cd Redison && npm install
```

##From npm
```sh:terminal
$ npm install redison
```

#Usage

##Overview
Redison provides simple method for setting callbacks for events of Redis subscriber by hashmap.

```js
var Redison = require("redison"),
    client = Redison.redisonize().startListener();

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
Redison extends [node_redis](https://github.com/mranney/node_redis) without overriding any method. You can use Redison client same as node_redis client.
  
In case of setting detail prameter of redis connection in node_redis client, you can decorate the node_redis client by ```redisonize``` method.

```js
var node_redis = require("redis"),
    nrClient = node_redis.createClient(port, host, options);
    
var redisonClient = require("redison").redisonize(nrClient);
```


##Subscribe with Event Map
Setting callbacks of redis subscriber events for every channel/pattern by hashmap.

### Precondition
```js
var Redison = require("redison"),
    client = Redison.redisonize();
```

###Start/Stop listener

####startListener([eventNames])

This activates listeners of redis subscriber events specified in ```[eventNames]```.

```js
client.startListener("subscribe","message");
```

In case of invokation with no arguments, ```startListener``` activates event listeners of all redis subscriber events: ```subscribe```, ```message```, ```unsubscribe```, ```psubscribe```, ```pmessage```, ```punsubscribe```.  


####stoplistener([eventNames])

This removes listeners of redis subscriber events specified in ```[eventNames]```.

```js
client.stopListener("subscribe","message");
```

In case of invokation with no arguments, ```stopListener``` removes event listeners of all redis subscriber events: ```subscribe```, ```message```, ```unsubscribe```, ```psubscribe```, ```pmessage```, ```punsubscribe```.  


###Common subscriber

####setSub(subMap)
Setting up common redis subscriber with callbacks defined in ```subMap```.

```js:invoke
client.setSub(subMap);
```

The ```subMap``` is written as follows:

```js
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
####setPsub(psubMap)
Setting up redis pattern subscriber with callbacks defined in ```psubMap```.

```js
client.setPsub(psubMap);
```

The ```psubMap``` is written as follows:

```js
var psubMap = {
    //patterns
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
