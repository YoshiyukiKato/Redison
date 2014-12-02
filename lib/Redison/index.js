var redis = require("redis");

var redisonize = function(redisClient){
    redisClient = redisClient || redis.createClient();
    var redison = Object.create(redisClient, {
        initListener:{
            writable:false,
            value:function(){
                if(arguments.length){
                    for(var i=0; i<arguments.length; i++){
                        if(arguments[i] === "subscribe"){
                            this.on("subscribe", this.cbInterface.subscribe.bind(this));
                        }
                        if(arguments[i] === "psubscribe"){
                            this.on("psubscribe", this.cbInterface.psubscribe.bind(this));
                        }
                        if(arguments[i] === "message"){
                            this.on("message", this.cbInterface.message.bind(this));
                        }
                        if(arguments[i] === "pmessage"){
                            this.on("pmessage", this.cbInterface.pmessage.bind(this));
                        }
                        if(arguments[i] === "unsubscribe"){
                            this.on("unsubscribe", this.cbInterface.unsubscribe.bind(this));
                        }
                        if(arguments[i] === "punsubscribe"){
                            this.on("punsubscribe", this.cbInterface.punsubscribe.bind(this));
                        }
                    }
                    return this;
                }else{
                    this.on("subscribe", this.cbInterface.subscribe.bind(this));
                    this.on("psubscribe", this.cbInterface.psubscribe.bind(this));
                    this.on("message", this.cbInterface.message.bind(this));
                    this.on("pmessage", this.cbInterface.pmessage.bind(this));
                    this.on("unsubscribe", this.cbInterface.unsubscribe.bind(this));
                    this.on("punsubscribe", this.cbInterface.punsubscribe.bind(this));
                    return this;
                }
                
            }  
        },
        stopListener:{
            writable:false,
            value:function(){
                //実験的に導入。できたらちょっと便利かも
                if(arguments.length){
                    for(var i=0; i<arguments.length; i++){
                        if(arguments[i] === "subscribe"){
                            removeEventListener(this,"subscribe");
                        }
                        if(arguments[i] === "psubscribe"){
                            removeEventListener(this,"psubscribe");
                        }
                        if(arguments[i] === "message"){
                            removeEventListener(this,"message");
                        }
                        if(arguments[i] === "pmessage"){
                            removeEventListener(this,"pmessage");
                        }
                        if(arguments[i] === "unsubscribe"){
                            removeEventListener(this,"unsubscribe");
                        }
                        if(arguments[i] === "punsubscribe"){
                            removeEventListener(this,"punsubscribe");
                        }
                    }
                    return this;
                }else{
                    removeEventListener(this,"subscribe");
                    removeEventListener(this,"psubscribe");
                    removeEventListener(this,"message");
                    removeEventListener(this,"pmessage");
                    removeEventListener(this,"unsubscribe");
                    removeEventListener(this,"punsubscribe");
                    return this;
                }
                function removeEventListener(client,event){
                    client.listeners(event).forEach(function(cbFunc){
                        client.removeListener(event, cbFunc);
                    });
                }
                
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
        hasCallback:{
            writable:false,
            value:function(channel){
                //return callback state of specified channel
                var cbState = {
                    subscribe:false,
                    message:false,
                    unsubscribe:false
                };
                if(this.subSetting.cbList.subscribe[channel]) cbState.subscribe = true;
                if(this.subSetting.cbList.message[channel]) cbState.message = true;
                if(this.subSetting.cbList.unsubscribe[channel]) cbState.unsubscribe = true;
                return cbState;
            }
        },
        hasPcallback:{
            writable:false,
            value:function(pattern){
                //return callback state of specified pattern
                var cbState = {
                    psubscribe:false,
                    pmessage:false,
                    punsubscribe:false
                };
                if(this.subSetting.cbList.psubscribe[pattern]) cbState.psubscribe = true;
                if(this.subSetting.cbList.pmessage[pattern]) cbState.pmessage = true;
                if(this.subSetting.cbList.punsubscribe[pattern]) cbState.punsubscribe = true;
                return cbState;
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
