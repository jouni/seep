var c = require("../../external/class");

var Flow = Class.extend({

	children: [],
	
	add: function(child) {
		this.children.push(child);
	},
	
	serialize: function() {
		// Proper serialization is done no application level (JSON.stringify)
		return this.children;
	}

});

exports.Flow = Flow;