var c = require("./external/class");
var sys = require("sys");

exports.Application = c.Class.extend({

	init: function(name){
		if(typeof name == 'undefined')
			this.name = "unnamed-seep-application";
		else
			this.name = name;
	},

	getSeepName: function(){
		return this.name;
	},

	getPath: function(){
		return this.path;
	},

	setPath: function(path){
		this.path = path;
	},
	
	setMainWindow: function(main) {
		this.mainWindow = main;
	},
	
	getMainWindow: function() {
		return this.mainWindow;
	},

	toString: function() {
  		if(typeof this.mainWindow != 'undefined') {
  			return JSON.stringify(this.mainWindow.serialize());
  		} else {
  			sys.puts("ERROR: No main window specified.");
  			mainWindow(); // generate exception
  		}
	}

});