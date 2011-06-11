var Field = require("./field").Field

exports.Button = Field.extend({

	init: function(text) {
		this._super(text)
		this.setType(__filename)
		this.removeStyle("s-field")
		this.addStyle("s-button")
	},
	
	click: function() {
		this.fireEvent({type:"click"})
	}

});