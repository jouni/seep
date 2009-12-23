var c = require("../../external/class");

var Flow = Class.extend({

	children: [],
	
	add: function(child) {
		this.children.push(child);
	},
	
	serialize: function() {
		var children = [];
		for(var i=0; i < this.children.length;i++) {
			children.push(this.children[i].serialize());
		}
		return {
			type: "layout.flow",
			c: children
		};
	}

});

exports.Flow = Flow;