//test of initListener with arguments
//and stopListener with arguments

var Redison = require("../lib/redison");
var subClient = Redison.redisonize().initListener("subscribe","message");

console.log(subClient.listeners("subscribe"));
console.log(subClient.listeners("message"));

subClient.stopListener("subscribe","message");

console.log(subClient.listeners("subscribe"));
console.log(subClient.listeners("message"));
