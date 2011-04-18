var Field = require("./field").Field

exports.Checkbox = Field.extend({

	init: function(text, checked) {
		this.syncProp("checked")
		this._super(text)
		this.setType(__filename)
		this.checked = checked
	}

});