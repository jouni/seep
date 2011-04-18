var Text = require("./text").Text

exports.Field = Text.extend({

	disabled: false,

	init: function(text) {
		this.syncProp("disabled")
		this._super(text)
		this.setType(__filename)
	}

});