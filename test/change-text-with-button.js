var seep = require("seep")

exports.app = seep.Application.extend({

	init: function() {
		this._super("Change text with button")
		
		this.change_me = new seep.Text("Click the button to change me.")
		this.add(this.change_me)
		
		this.button = new seep.Button("Change the text")
		
		var handler = function(e) {
			this.change_me.text = new Date()
		}
		
		this.button.addListener("click", handler, {bind: this, id: "handler"})
		
		this.clientside = false
		this.toggle = new seep.Checkbox("Clientside events")
		this.toggle.addListener("change", function(e) {
			this.button.removeListener("handler")
			if(e.source.checked)
				this.button.addListener("click", handler, {bind: this, id: "handler", client: true})
			else
				this.button.addListener("click", handler, {bind: this, id: "handler"})
		}, {bind: this})
		
		this.add(this.button)
		this.add(this.toggle)
	}
	
})