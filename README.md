#About
Redis subscribe event mapper for node-redis.

#Setup and Test

```sh:terminal
$ npm install
$ node test.js
```

#Usage

```js:usage
var Redison = require("/path/to/Redison.js"),
    client = Redison.redisonize();

client.subSetter({
    //channel name of subscribing
    subChannel:{
        //eventName:callbackFunc
        subscribe:function(channel,count){
        
        },
        message:function(channel,message){
        
        }
    }
});

```

