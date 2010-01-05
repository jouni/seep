var Widget = require("./widget").Widget;

exports.Button = Widget.extend({

	type: "seep.ui.button",

	caption: null,
	
	init: function(caption) {
		this._super();
		this.caption = caption;
	},
	
	serialize: function(out) {
		this._super(out);
		out.caption = this.caption;
		return out;
	}

});