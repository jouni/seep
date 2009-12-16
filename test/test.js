var seep = require("../seep");


// Add applications to Seep server
// params: Seep script, URI
var one = seep.add(require("./app-one"), "/one");


// Start serving the apps
//var HOST = null; // localhost
var PORT = 9000;
seep.start(PORT);


// Apps can be added after start, too
var two = seep.add(require("./app-two"), "/two");


// Multiple apps in same uri should fail
//var two = seep.add("./app-one", "/two");