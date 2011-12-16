var Field = require("./field")
  , Focusable = require("./focusable")
  , Text = require("./text").Text

exports.Input = Focusable.make(Field.make(
	Text.extend({

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
			this.removeStyle("s-text")
			this.addStyle("s-input")
		}

	})
))