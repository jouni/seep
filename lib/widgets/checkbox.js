var Field = require("./field")
  , Focusable = require("./focusable")
  , Text = require("./text").Text

exports.Checkbox = Focusable.make(Field.make(
	Text.extend({

		init: function(text, checked) {
			this._super(text)
			this.syncProp("checked")
			this.setType(__filename)
			this.removeStyle("s-text")
			this.addStyle("s-checkbox")
			this.checked = checked
			
			var self = this
			this.watch("checked", function(prop, old, val) {
			    if(old != val && this.synching) {
			    	self.outBuffer[prop] = val
			    	self.repaint()
			    	setTimeout(function() {self.fireEvent({type:"change"})}, 0)
			    }
			    return val
			})
		},
		
		fireEvent: function(event) {
			this._super(event)
		}

	})
))