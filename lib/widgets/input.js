var Field = require("./field").Field

exports.Input = Field.extend({

	init: function(text, props) {
		var props = props || {}
		if(props.multiline) {
			this.pushProp("multiline")
		}
		this.pushProp("placeholder")
		this._super(text)
		this.setType(__filename)
		this.multiline = props.multiline || false
		this.syncProp("text")
		this.removeStyle("s-field")
		this.addStyle("s-input")
	}

});