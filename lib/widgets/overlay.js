var Flow = require("./layout").Flow;

exports.Overlay = Flow.extend({
	
	init: function() {
		this.pushProp("top")
		this.pushProp("left")
		this._super()
		this.setType(__filename)
		this.top = "0"
		this.left = "0"
		this.visible = false
	}

});