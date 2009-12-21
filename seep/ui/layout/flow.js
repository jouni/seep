var c = require("../../external/class");

var Flow = Class.extend({

	children: [],
	
	add: function(child) {
		this.children.push(child);
	},
	
	serialize: function() {
		var ret = "[";
		for(i=0; i < this.children.length; i++) {
			ret += this.children[i].serialize();
			if(i>0)
				ret += ",";
		}
		ret += "]";
		return ret;
	}

});

exports.Flow = Flow;