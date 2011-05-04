var seep = require("seep")

exports.app = seep.Application.extend({

	init: function() {
		this._super("Popup")
		
		var layout = new seep.layout.Flow({wrap: "div.row"})
		this.add(layout)
		
		this.button = new seep.Button("Open popup")
		this.popup = new seep.Overlay()
		this.popup.add(new seep.Text("Popup content"))
		this.add(this.popup) // Overlays can only be added to the application, not to layouts
				
		var handler = function(e) {
			this.popup.visible = !this.popup.visible
			if(this.popup.visible) {
				this.popup.top = (e.pageY + e.source.pixelHeight) + "px"
				this.popup.left = e.pageX + "px"
				this.popup.width = e.source.pixelWidth + "px"
			}
		}
		
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