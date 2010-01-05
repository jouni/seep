var Widget = require("./widget").Widget;

exports.Text = Widget.extend({

	type: "seep.ui.text",

	text: null,
	
	init: function(text) {
		this._super();
		this.text = text;
	},
	
	serialize: function(out) {
		out = this._super(out);
		out.text = this.text;
		return out;
	}

});