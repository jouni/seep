var c = require("../external/class");

var Text = Class.extend({

	text: null,
	
	init: function(text) {
		this.text = text;
	},
	
	serialize: function() {
		return this.text;
	}

});

exports.Text = Text;