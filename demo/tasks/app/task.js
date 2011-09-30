var seep = require("seep")
  , mongoose = require("mongoose")

exports.TaskModel = new mongoose.Schema({
    title     : String
  , isDone    : Boolean
  , finished  : Date
})

exports.Task = seep.layout.Flow.extend({
	
	init: function(description, isDone) {
		this._super()
		this.addStyle("task")
		
		this.input = new seep.Input(description)
		this.doneBtn = new seep.Checkbox()
		this.deleteBtn = new seep.Button("&times;")
		
		this.doneBtn.addListener("change", function(e) {
			this.setDone(!this.doneBtn.checked)
		}, {bind: this})
		
		this.deleteBtn.addListener("click", function() {
			var index = this.parent.getWidgetIndex(this)
			var parent = this.parent
			this.parent.remove(this, {animate: true})
			if(parent.getWidget(index))
				parent.getWidget(index).focus()
		}, {bind: this})
		
		this.deleteBtn.addListener("mouseover", function() {
			this.addStyle("hover")
		}, {bind: this, client: true})
		/*this.deleteBtn.addListener("mouseleave", function() {
			this.removeStyle("hover")
		}, {bind: this, client: true})*/
		
		this.addListener("mouseover", function() {
			this.removeStyle("hover")
		}, {bind: this, client: true})
		
		this.deleteBtn.tooltip = "Delete Task"
		
		this.doneBtn.addStyle("done")
		this.deleteBtn.addStyle("delete")
		
		this.add(this.doneBtn)
		this.add(this.input)
		this.add(this.deleteBtn)
		
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
						next.parent.add(next.parent.remove(this), {index: next.parent.getWidgetIndex(next)})
					} else if(e.keyCode == 40 && this.parent.getWidgetIndex(this) < this.parent.count()-1) {
						// Move down
						next.parent.add(next.parent.remove(this), {index: next.parent.getWidgetIndex(next)+1})
					}
					this.focus()
				} else if(next) next.focus()
			}
		}, {bind: this})
		
		this.input.addListener("keydown", function(e) {
			 if(e.keyCode == 8 && e.altKey) {
			 	// Alt + Backspace
				this.deleteBtn.click()
				e.preventDefault()
				e.stopPropagation()
			} else if(e.keyCode == 13) {
				// Enter
				this.doneBtn.checked = !this.doneBtn.checked
				if(this.doneBtn.checked)
					this.addStyle("done")
				else this.removeStyle("done")
			}
		}, {bind: this, client: true})
		
		/*this.input.addListener("change", function() {
			console.log(this.text)
		}, {bind: this.input, client: true})*/
		
		this.addListener("click", function() {
			this.input.focus()
		}, {bind: this, client: true})
		
		if(isDone) {
			this.setDone()
		}
		
	},
	
	focus: function() {
		if(this.input.visible)
			this.input.focus()
	},
	
	setDone: function(undone) {
		this.doneBtn.checked = !undone
		this.input.readonly = this.doneBtn.checked
		this.input.focus()
		if(this.doneBtn.checked)
			this.addStyle("done")
		else
			this.removeStyle("done")
	}
	
})

