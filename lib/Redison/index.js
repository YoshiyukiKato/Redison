var redis = require("redis");

var redisonize = function(redisClient){
    redisClient = redisClient || redis.createClient();
    var redison = Object.create(redisClient, {
        initListener:{
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
                        if(subMap[subChannel].message){
                            this.subSetting.cbList.message[subChannel] = subMap[subChannel].message.bind(this);
                        }
                        if(subMap[subChannel].unsubscribe){
                            this.subSetting.cbList.unsubscribe[subChannel] = subMap[subChannel].unsubscribe.bind(this);
                        }
                        this.subscribe(subChannel);
                    }    
                }.bind(this));
            }
        },
        setPsub:{
            writable:false,
            value:function(psubMap){
                if(!psubMap) throw new Error();
                Object.keys(psubMap).forEach(function(pattern,index){
                    if(pattern){
                        if(psubMap[pattern].psubscribe){
                            this.subSetting.cbList.psubscribe[pattern] = psubMap[pattern].psubscribe.bind(this);    
                        }
                        if(psubMap[pattern].pmessage){
                            this.subSetting.cbList.pmessage[pattern] = psubMap[pattern].pmessage.bind(this);
                        }    
                        if(psubMap[pattern].punsubscribe){
                            this.subSetting.cbList.punsubscribe[pattern] = psubMap[pattern].punsubscribe.bind(this);
                        }
                        this.psubscribe(pattern);
                    } 
                }.bind(this));
            }
        },
        stateUnsub:{
            writable:false,
            value:function(unsubChannel,quitState){
                if(!unsubChannel)throw new Error();
                if(quitState){
                    //delete cb functions
                    this.unsubscribe(unsubChannel);
                    delete this.subSetting.cbList.subscribe[unsubChannel];
                    delete this.subSetting.cbList.message[unsubChannel];
                    delete this.subSetting.cbList.unsubscribe[unsubChannel];
                }else{
                    //not delete cb functions
                    this.unsubscribe(unsubChannel);
                }
            }
        },
        statePunsub:{
            writable:false,
            value:function(punsubPattern,quitState){
                if(!punsubPattern)throw new Error();
                if(quitState){
                    //delete cb functions
                    this.punsubscribe(punsubPattern);
                    delete this.subSetting.cbList.psubscribe[punsubPattern];
                    delete this.subSetting.cbList.pmessage[punsubPattern];
                    delete this.subSetting.cbList.punsubscribe[punsubPattern];
                }else{
                    //not delete cb functions
                    this.punsubscribe(punsubPattern);
                }
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
                psubscribe:function(pattern,count){
                    if(this.subSetting.cbList.psubscribe[pattern]){
                        this.subSetting.cbList.psubscribe[pattern](pattern,count);
                    }
                },
                message:function(channel,message){
                    if(this.subSetting.cbList.message[channel]){
                        this.subSetting.cbList.message[channel](channel,message);
                    }    
                },
                pmessage:function(pattern,channel,message){
                    if(this.subSetting.cbList.pmessage[pattern]){
                        this.subSetting.cbList.pmessage[pattern](pattern,channel,message);
                    }
                },
                unsubscribe:function(channel,count){
                    if(this.subSetting.cbList.unsubscribe[channel]){
                        this.subSetting.cbList.unsubscribe[channel](channel,count);
                    }
                },
                punsubscribe:function(pattern,count){
                    if(this.subSetting.cbList.punsubscribe[pattern]){
                        this.subSetting.cbList.punsubscribe[pattern](pattern,count);
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
