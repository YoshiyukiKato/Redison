var redis = require("redis");

var redisonize = function(redisClient){
    redisClient = redisClient || redis.createClient();
    var redison = Object.create(redisClient, {
        subSetter:{
            writable:false,
            value: function(subMap){
                subMap = subMap || this.setting.sub;
                Object.keys(subMap).forEach(function(subChannel){
                    if(subChannel){
                        if(subMap[subChannel].subscribe){
                            this.on("subscribe", subMap[subChannel].subscribe.bind(this));
                        }
                        if(subMap[subChannel].psubscribe){
                            this.on("psubscribe", subMap[subChannel].psubscribe.bind(this));
                        }
                        if(subMap[subChannel].message){
                            this.on("message", subMap[subChannel].message.bind(this));
                        }
                        if(subMap[subChannel].pmessage){
                            this.on("pmessage", subMap[subChannel].pmessage.bind(this));
                        }
                        if(subMap[subChannel].unsubscribe){
                            this.on("unsubscribe", subMap[subChannel].unsubscribe.bind(this));
                        }    
                        if(subMap[subChannel].punsubscribe){
                            this.on("punsubscribe", subMap[subChannel].punsubscibe.bind(this));
                        }   
                        this.subscribe(subChannel);
                    }
                }.bind(this));  
            }
        },
        subSetting:{
            writable:true,
            value:{}
        }
    });
    return redison;
}
    
exports.redisonize = redisonize;