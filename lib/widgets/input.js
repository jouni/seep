var Field = require("./field").Field

exports.Input = Field.extend({

	init: function(text) {
		this._super(text)
		this.setType(__filename)
	}

});