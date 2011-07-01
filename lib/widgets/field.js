var Text = require("./text").Text

exports.Field = Text.extend({

	init: function(text) {
		this.pushProp("disabled")
		this.pushProp("readOnly")
		this.pushProp("tabIndex")
		this._super(text)
		this.setType(__filename)
		this.removeStyle("s-text")
		this.addStyle("s-field")
	},
	
	focus: function() {
		if(this.application) {
			this.application.focus(this)
		} else {
			this._pendingFocus = true
		}
	},
	
	setApplication: function(app) {
		this._super(app)
		if(this._pendingFocus) {
			app.focus(this)
			this._pendingFocus = false
		}
	}

});