var c = require("../external/class");

exports.Window = c.Class.extend({

	init: function(title){
		this.title = title;
	},
	
	getTitle: function() {
		return this.title;
	},

	serialize: function() {
		return "main window serialize: "+this.title;
	}
    
});