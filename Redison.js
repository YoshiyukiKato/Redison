var redis = require("redis");

var redisonize = function(redisClient){
    redisClient = redisClient || redis.createClient();
    var redison = Object.create(redisClient, {
        subSetter:{
            writable:false,
            value: function(subMap){
                
                this.on("subscribe", this.cbInterface.subscribe.bind(this));
                this.on("psubscribe", this.cbInterface.psubscribe.bind(this));
                this.on("message", this.cbInterface.message.bind(this));
                this.on("pmessage", this.cbInterface.pmessage.bind(this));
                this.on("unsubscribe", this.cbInterface.unsubscribe.bind(this));
                this.on("punsubscribe", this.cbInterface.punsubscribe.bind(this));
                
                subMap = subMap || this.setting.sub;
                Object.keys(subMap).forEach(function(subChannel,index){
                    if(subChannel){
                        if(subMap[subChannel].subscribe){
                            this.subSetting.cbList.subscribe[subChannel] = subMap[subChannel].subscribe//.bind(this); 
                        }
                        if(subMap[subChannel].psubscribe){
                            this.subSetting.cbList.psubscribe[subChannel] = subMap[subChannel].psubscribe//.bind(this);    
                        }
                        if(subMap[subChannel].message){
                            this.subSetting.cbList.message[subChannel] = subMap[subChannel].message//.bind(this);
                        }
                        if(subMap[subChannel].pmessage){
                            this.subSetting.cbList.pmessage[subChannel] = subMap[subChannel].pmessage//.bind(this);
                        }
                        if(subMap[subChannel].unsubscribe){
                            this.subSetting.cbList.unsubscribe[subChannel] = subMap[subChannel].unsubscribe//.bind(this);
                        }    
                        if(subMap[subChannel].punsubscribe){
                            this.subSetting.cbList.punsubscribe[subChannel] = subMap[subChannel].punsubscribe//.bind(this);
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
                psubscribe:function(channel,count){
                    if(this.subSetting.cbList.psubscribe[channel]){
                        this.subSetting.cbList.psubscribe[channel](channel,count);
                    }
                },
                message:function(channel,message){
                    if(this.subSetting.cbList.message[channel]){
                        this.subSetting.cbList.message[channel](channel,message);
                    }    
                },
                pmessage:function(channel,message){
                    if(this.subSetting.cbList.pmessage[channel]){
                        this.subSetting.cbList.pmessage[channel](channel,message);
                    }
                },
                unsubscribe:function(channel,count){
                    if(this.subSetting.cbList.unsubscribe[channel]){
                        this.subSetting.cbList.unsubscribe[channel](channel,count);
                    }
                },
                punsubscribe:function(channel,count){
                    if(this.subSetting.cbList.punsubscribe[channel]){
                        this.subSetting.cbList.punsubscribe[channel](channel,count);
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
