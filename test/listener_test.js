var Redison = require("../lib/redison");
var subClient = Redison.redisonize().initListener("subscribe","message");

console.log(subClient.listeners("subscribe"));
console.log(subClient.listeners("message"));

subClient.stopListener("subscribe");
subClient.stopListener("message");

console.log(subClient.listeners("subscribe"));
console.log(subClient.listeners("message"));
