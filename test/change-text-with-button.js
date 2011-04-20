var seep = require("seep")

exports.app = seep.Application.extend({

	init: function() {
		this._super("Change text with button")
		
		var layout = new seep.layout.Flow({wrap: "div.row"})
		this.add(layout)
		
		this.change_me = new seep.Text("Click the button to show current time")
		layout.add(this.change_me)
		
		this.button = new seep.Button("Server date")
		
		var handler = function(e) {
			this.change_me.text = new Date()
		}
		
		this.button.addListener("click", handler, {bind: this, id: "handler"})
		
		this.toggle = new seep.Checkbox("Clientside events")
		this.toggle.addListener("change", function(e) {
			this.button.removeListener("handler")
			if(e.source.checked) {
				this.button.text = "Browser date"
				this.button.addListener("click", handler, {bind: this, id: "handler", client: true})
			} else {
				this.button.text = "Server date"
				this.button.addListener("click", handler, {bind: this, id: "handler"})
			}
		}, {bind: this})
		
		layout.add(this.button)
		layout.add(this.toggle)
	}
	
})