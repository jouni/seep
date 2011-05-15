var seep = require("seep")

exports.app = seep.Application.extend({

	init: function() {
		this._super("Set size")
		
		var layout = new seep.layout.Flow({wrap: "div.row"})
		this.add(layout)
		
		this.change_me = new seep.Input("", {multiline: true})
		layout.add(this.change_me)
		
		var widthLayout = new seep.layout.Flow()
		var label = new seep.Text("Width ")
		label.width = "3.2em"
		widthLayout.add(label)
		this.width = new seep.Input()
		this.width.width = "4em"
		widthLayout.add(this.width)
		layout.add(widthLayout)
		
		var heightLayout = new seep.layout.Flow()
		label = new seep.Text("Height ")
		label.width = "3.2em"
		heightLayout.add(label)
		this.height = new seep.Input()
		this.height.width = "4em"
		heightLayout.add(this.height)
		layout.add(heightLayout)
		
		this.button = new seep.Button("Set")
		
		var handler = function(e) {
			this.change_me.width = this.width.text
			this.change_me.height = this.height.text
			this.change_me.text = this.change_me.pixelWidth + "px x " + this.change_me.pixelHeight + "px"
		}
		
		this.change_me.addListener("attach", function() {
			this.width.text = this.change_me.pixelWidth + "px"
			this.height.text = this.change_me.pixelHeight + "px"
			this.change_me.text = this.change_me.pixelWidth + "px x " + this.change_me.pixelHeight + "px"
		}, {bind: this, client: true})
		
		var enterHandler = function(event) {
			if(event.keyCode==13)
				this.button.click()
		}
		this.height.addListener("keypress", enterHandler, {bind: this, client: true})
		this.width.addListener("keypress", enterHandler, {bind: this, client: true})
		
		this.button.addListener("click", handler, {bind: this, id: "handler"})
		
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