var seep = require("seep")
  , Task = require("./app/task").Task


exports.app = seep.Application.extend({

	init: function() {
		this._super("Seep Tasks")
		
		this.layout = new seep.layout.Flow()
		this.add(this.layout)
		
		this.newTask = new seep.Input()
		this.newTask.placeholder = "Create new task..."
		this.newButton = new seep.Button("+")
		this.newButton.tooltip = "Create Task"
		
		this.newButton.addListener("click", function() {
			if(this.newTask.text) {
				this.layout.add(new Task(this.newTask.text), 1)
				this.newTask.text = ""
			}
		}, {bind: this})
		
		this.newTask.addListener("keydown", function(e) {
			if(e.keyCode==13) this.newButton.click()
		}, {bind: this, client: true})
		
		var newLayout = new seep.layout.Flow()
		newLayout.addStyle("add-task")
		
		newLayout.add(this.newTask)
		newLayout.add(this.newButton)
		this.layout.add(newLayout)
		
		this.layout.add(new Task("Create a super-awesome, simple task manager app using Seep"))
		
		this.newTask.addListener("keydown", function(e) {
			if(e.keyCode==40) {
				var i = 1
				var next = this.layout.getWidget(i)
				while(next && next.isDone)
					next = this.layout.getWidget(++i)
				if(next) next.focus()
			}
		}, {bind: this})
		
	}
	
})