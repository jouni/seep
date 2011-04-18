var Widget = require("./widget").Widget;

exports.Text = Widget.extend({
	
	init: function(text) {
		this.syncProp("text")
		this._super(__filename)
		this.text = text
	}

});