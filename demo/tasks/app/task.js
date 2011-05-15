var seep = require("seep")
 //  , mongoose = require("mongoose")
/*
exports.TaskModel = new mongoose.Schema({
    title        : String
  , isDone    : Boolean
  , finished   : Date
});
*/
exports.Task = seep.layout.Flow.extend({
	
	init: function(description) {
		this._super()
		this.addStyle("task")
		
		this.input = new seep.Input(description)
		this.done = new seep.Checkbox()
		this.del = new seep.Button("&times;")
		
		this.done.addListener("change", function(e) {
			//this.input.visible = !this.done.checked
			this.isDone = this.done.checked
			if(this.done.checked)
				this.addStyle("done")
			else
				this.removeStyle("done")
		}, {bind: this})
		
		this.del.addListener("click", function() {
			var index = this.parent.getWidgetIndex(this)
			var parent = this.parent
			this.parent.remove(this)
			if(parent.getWidget(index))
				parent.getWidget(index).focus()
		}, {bind: this})
		/*this.del.addListener("mouseenter", function() {
			this.addStyle("hover")
		}, {bind: this, client: true})
		this.del.addListener("mouseleave", function() {
			this.removeStyle("hover")
		}, {bind: this, client: true})*/
		this.del.tooltip = "Delete Task"
		
		this.done.addStyle("done")
		this.del.addStyle("delete")
		
		this.add(this.done)
		this.add(this.input)
		this.add(this.del)
		
		// Focus mangement: move focus with up and down arrows
		this.input.addListener("keydown", function(e) {
			if(e.keyCode == 38 || e.keyCode == 40) {
				var i = this.parent.getWidgetIndex(this)
				var next = null
				
				if(e.keyCode == 38 && !e.altKey && i == 1) {
					this.parent.getWidget(0).getWidget(0).focus()
					return
				}
				
				if(e.keyCode == 40) {
					// Down
					while(i < this.parent.count()-1) {
						next = this.parent.getWidget(++i)
						if(next) break;
					}
				} else if(e.keyCode == 38) {
					// Up
					while(i > 1) {
						// Up
						next = this.parent.getWidget(--i)
						if(next) break;
					}
				}
				
				if(next && e.altKey) {
					if(e.keyCode == 38 && this.parent.getWidgetIndex(this) > 0) {
						// Move up
						next.parent.add(next.parent.remove(this), next.parent.getWidgetIndex(next))
					} else if(e.keyCode == 40 && this.parent.getWidgetIndex(this) < this.parent.count()-1) {
						// Move down
						next.parent.add(next.parent.remove(this), next.parent.getWidgetIndex(next)+1)
					}
					this.focus()
				} else if(next) next.focus()
			} else if(e.keyCode == 13 && e.altKey) {
				this.done.checked = !this.done.checked
			}
		}, {bind: this})
		this.input.addListener("keydown", function(e) {
			 if(e.keyCode == 8 && e.altKey) {
				this.del.click()
				e.preventDefault()
				e.stopPropagation()
			}
		}, {bind: this, client: true})
		
		this.addListener("click", function() {
			if(this.input.visible)
				this.input.focus()
		}, {bind: this, client: true})
		
	},
	
	focus: function() {
		if(this.input.visible)
			this.input.focus()
	}
	
})

