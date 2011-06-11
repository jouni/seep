var seep = require("seep")

exports.app = seep.Application.extend({

	init: function() {
		this._super("Add & remove widgets from a layout")
		
		this.layout = new seep.layout.Flow({wrap: "div.row"})
		this.add(this.layout)
		
		var add = new seep.Button("Add");
		add.addListener("click", function() {
			this.layout.add(new seep.Text("Widget #" + (this.layout.count()+1)))
			this.remove.disabled = false
		}, {bind: this})
		this.layout.add(add)
		add.tooltip = "Add new text component to the end of this layout"
		add.width = "8em"
		
		this.remove = new seep.Button("Remove");
		this.remove.addListener("click", function() {
			if(this.layout.count() > 2)
				this.layout.remove(this.layout.count()-1, {animate: true})
			if(this.layout.count()==2)
				this.remove.disabled = true
		}, {bind: this})
		this.layout.add(this.remove)
		
		this.remove.disabled = true
		this.remove.tooltip = "Remove the last text from this layout"
		this.remove.width = "8em"
	}
	
})