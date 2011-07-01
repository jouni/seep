var Flow = require("./layout").Flow;

exports.Overlay = Flow.extend({
	
	init: function(props) {
		if(!props)
			var props = {}
		this.pushProp("top")
		this.pushProp("left")
		this.pushProp("center")
		this._super(props)
		this.setType(__filename)
		if(props.center)
			this.center = true
		this.removeStyle("s-flow")
		this.addStyle("s-overlay")
	}

});