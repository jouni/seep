var Flow = require("./layout").Flow;

exports.Overlay = Flow.extend({
	
	init: function() {
		this.syncProp("top")
		this.syncProp("left")
		this._super()
		this.setType(__filename)
		this.top = "0"
		this.left = "0"
		this.visible = false
	}

});