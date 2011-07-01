var seep = require("seep")

exports.app = seep.Application.extend({

	init: function() {
		this._super("Input Events")
		
		var layout = new seep.layout.Flow({wrap: "div.row"})
		this.add(layout)
		
		this.change_me = new seep.Input("Text")
		layout.add(this.change_me)
		
		this.button = new seep.Button("Button")
		this.button.tooltip = "The state of the button should change depending on the content of the input area"
		
		var handler = function(e) {
			this.button.disabled = !(this.change_me.text && this.change_me.text.length > 0)
		}
		
		this.change_me.addListener("keyup", handler, {bind: this, id: "handler"})
		
		this.toggle = new seep.Checkbox("Clientside events")
		this.toggle.addListener("change", function(e) {
			this.button.removeListener("handler")
			if(e.source.checked) {
				this.button.addListener("click", handler, {bind: this, id: "handler", client: true})
			} else {
				this.button.addListener("click", handler, {bind: this, id: "handler"})
			}
		}, {bind: this})
		
		layout.add(this.button)
		layout.add(this.toggle)
		
	}
	
})