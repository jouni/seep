var Field = require("./field")
  , Focusable = require("./focusable")
  , Flow = require("./layout").Flow
  , Text = require("./text").Text

// Extend from the layout class so we can have more versatile buttons (icons etc.)
exports.Button = Focusable.make(Field.make(
	Flow.extend({

		init: function(text) {
			this._super()
			this.setType(__filename)
			this.removeStyle("s-flow")
			this.addStyle("s-button")
			this.caption = new Text(text)
			this.add(this.caption)
		},
		
		click: function() {
			this.fireEvent({type:"click"})
		}

	})
))