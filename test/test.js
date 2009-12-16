var seep = require("../seep");


// Add applications to Seep server
// params: Seep script, URI
var one = seep.add("./app-one.js", "/one");


// Start serving the apps
var HOST = null; // localhost
var PORT = 9000;
seep.start(HOST, PORT);


// Apps can be added after start, too
var two = seep.add("./app-two.js", "/two");


// Multiple apps in same uri should fail
var two = seep.add("./app-one.js", "/two");