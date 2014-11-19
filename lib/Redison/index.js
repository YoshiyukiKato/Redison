var redis = require("redis");

var redisonize = function(redisClient){
    redisClient = redisClient || redis.createClient();
    var redison = Object.create(redisClient, {
        initSub:{
            writable:false,
            value:function(){
                this.on("subscribe", this.cbInterface.subscribe.bind(this));
                this.on("psubscribe", this.cbInterface.psubscribe.bind(this));
                this.on("message", this.cbInterface.message.bind(this));
                this.on("pmessage", this.cbInterface.pmessage.bind(this));
                this.on("unsubscribe", this.cbInterface.unsubscribe.bind(this));
                this.on("punsubscribe", this.cbInterface.punsubscribe.bind(this));
                return this;
            }
            
        },
        setSub:{
            writable:false,
            value: function(subMap){
                if(!subMap) throw new Error();
                Object.keys(subMap).forEach(function(subChannel,index){
                    if(subChannel){
                        if(subMap[subChannel].subscribe){
                            this.subSetting.cbList.subscribe[subChannel] = subMap[subChannel].subscribe.bind(this); 
                        }
                        if(subMap[subChannel].psubscribe){
                            this.subSetting.cbList.psubscribe[subChannel] = subMap[subChannel].psubscribe.bind(this);    
                        }
                        if(subMap[subChannel].message){
                            this.subSetting.cbList.message[subChannel] = subMap[subChannel].message.bind(this);
                        }
                        if(subMap[subChannel].pmessage){
                            this.subSetting.cbList.pmessage[subChannel] = subMap[subChannel].pmessage.bind(this);
                        }
                        if(subMap[subChannel].unsubscribe){
                            this.subSetting.cbList.unsubscribe[subChannel] = subMap[subChannel].unsubscribe.bind(this);
                        }    
                        if(subMap[subChannel].punsubscribe){
                            this.subSetting.cbList.punsubscribe[subChannel] = subMap[subChannel].punsubscribe.bind(this);
                        }
                        this.subscribe(subChannel);
                    }
                    
                }.bind(this));  
            }
        },
        cbInterface:{
            writable:false,
            value:{
                subscribe:function(channel,count){
                    if(this.subSetting.cbList.subscribe[channel]){
                        this.subSetting.cbList.subscribe[channel](channel,count);
                    }
                },
                psubscribe:function(pattern,channel,count){
                    if(this.subSetting.cbList.psubscribe[channel]){
                        this.subSetting.cbList.psubscribe[channel](pattern,channel,count);
                    }
                },
                message:function(channel,message){
                    if(this.subSetting.cbList.message[channel]){
                        this.subSetting.cbList.message[channel](channel,message);
                    }    
                },
                pmessage:function(pattern,channel,message){
                    if(this.subSetting.cbList.pmessage[channel]){
                        this.subSetting.cbList.pmessage[channel](pattern,channel,message);
                    }
                },
                unsubscribe:function(channel,count){
                    if(this.subSetting.cbList.unsubscribe[channel]){
                        this.subSetting.cbList.unsubscribe[channel](channel,count);
                    }
                },
                punsubscribe:function(pattern,channel,count){
                    if(this.subSetting.cbList.punsubscribe[channel]){
                        this.subSetting.cbList.punsubscribe[channel](pattern,channel,count);
                    }
                }
            }
        },
        subSetting:{
            writable:true,
            value:{
                cbList:{
                    subscribe:{},
                    psubscribe:{},
                    message:{},
                    pmessage:{},
                    unsubscribe:{},
                    punsubscribe:{}
                }
            }
        }
    });
    return redison;
}

exports.redisonize = redisonize;
