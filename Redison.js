var redis = require("redis");

var Redison = function(setting){
    this.client = redis.createClient();
    this.setting = setting || { sub:{}, pub:{}};    
};

Redison.prototype.subscribe = function(subMap){
    subMap = subMap || this.setting.sub;
    Object.keys(subMap).forEach(function(subChannel){
        if(subChannel){
            if(subMap[subChannel].subscribe){
                this.client.on("subscribe", subMap[subChannel].subscribe.bind(this));
            }
            if(subMap[subChannel].psubscribe){
                this.client.on("psubscribe", subMap[subChannel].psubscribe.bind(this));
            }
            if(subMap[subChannel].message){
                this.client.on("message", subMap[subChannel].message.bind(this));
            }
            if(subMap[subChannel].pmessage){
                this.client.on("pmessage", subMap[subChannel].pmessage.bind(this));
            }
            if(subMap[subChannel].unsubscribe){
                this.client.on("unsubscribe", subMap[subChannel].unsubscribe.bind(this));
            }    
            if(subMap[subChannel].punsubscribe){
                this.client.on("punsubscribe", subMap[subChannel].punsubscibe.bind(this));
            }   
            this.client.subscribe(subChannel);
        }
    }.bind(this));    
};

Redison.prototype.publish = function(channel, obj){
    var message = JSON.stringify(obj);
    this.client.publish(channel, message);
};

Redison.prototype.unsubscribe = function(channel){
    this.client.unsubscribe(channel);
}

Redison.prototype.punsubscribe = function(pchannel){
    this.client.unsubscribe(pchannel);
}

exports.init = Redison;