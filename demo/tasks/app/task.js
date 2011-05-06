var seep = require("seep")

exports.Task = seep.layout.Flow.extend({
	
	init: function(description) {
		this._super()
		this.addStyle("task")
		
		this.input = new seep.Input(description)
		this.text = new seep.Text()
		this.done = new seep.Checkbox()
		this.del = new seep.Button("&times;")
		
		this.done.addListener("change", function(e) {
			this.input.visible = !this.done.checked
			this.text.visible = this.done.checked
			this.text.text = this.input.text
			this.isDone = this.done.checked
			if(this.done.checked)
				this.addStyle("done")
			else
				this.removeStyle("done")
			//this.parent.add(this.parent.remove(this))
		}, {bind: this})
		
		this.del.addListener("click", function() {
			this.parent.remove(this)
		}, {bind: this})
		this.del.tooltip = "Delete Task"
		
		this.done.addStyle("done")
		this.del.addStyle("delete")
		
		this.add(this.done)
		this.add(this.input)
		this.add(this.text)
		this.add(this.del)
		
		// Focus mangement: move focus with up and down arrows
		this.input.addListener("keydown", function(e) {
			if(e.keyCode == 38 || e.keyCode == 40) {
				var i = this.parent.getWidgetIndex(this)
				var next = null
				if(e.keyCode == 40) {
					// Down
					while(i < this.parent.count()-1) {
						next = this.parent.getWidget(++i)
						if(next && !next.isDone) break;
					}
				} else if(e.keyCode == 38) {
					// Up
					while(i > 1) {
						// Up
						next = this.parent.getWidget(--i)
						if(next && !next.isDone) break;
					}
				}
				if(next) next.focus()
			}
		}, {bind: this})
		
	},
	
	focus: function() {
		if(this.input.visible)
			this.input.focus()
	}
	
})

