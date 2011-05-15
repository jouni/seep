var seep = require("seep")

exports.app = seep.Application.extend({

	init: function() {
		this._super("Toggle visibility")
		
		var layout = new seep.layout.Flow({wrap: "div.row"})
		this.add(layout)
		
		this.change_me = new seep.Text("Peek-a-Boo!")
		this.change_me.visible = false
		layout.add(this.change_me)
		
		this.button = new seep.Button("Show")
		
		var handler = function(e) {
			this.change_me.visible = !this.change_me.visible
			this.button.text = this.change_me.visible ? "Hide" : "Show"
		}
		
		this.button.addListener("click", handler, {bind: this, id: "handler", client: true})
		
		this.toggle = new seep.Checkbox("Clientside events", true)
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