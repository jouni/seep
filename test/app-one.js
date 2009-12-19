var seep = require("../seep");
var sys = require("sys");

var app = new seep.Application("My application");
var w = new seep.ui.Window("my window");
app.setMainWindow(w);


exports.foobar = app;