var Text = require("./text").Text

exports.Field = Text.extend({

	init: function(text) {
		this.syncProp("disabled")
		this._super(text)
		this.setType(__filename)
		this.disabled = false
	},
	
	focus: function() {
		if(this.application) {
			this.application.focus(this)
		} else {
			this.pendingFocus = true
		}
	},
	
	setApplication: function(app) {
		this._super(app)
		if(this.pendingFocus)
			app.focus(this)
	}

});