var Widget = require("./widget").Widget;

exports.Text = Widget.extend({
	
	init: function(text) {
		this.pushProp("text")
		this._super(__filename)
		this.text = text
	}

});