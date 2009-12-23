var c = require("../external/class");

exports.Text = Class.extend({

	text: null,
	
	init: function(text) {
		this.text = text;
	},
	
	serialize: function() {
		return {
			type: "text",
			text: this.text
		};
	}

});