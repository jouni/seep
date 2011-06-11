var seep = require("seep")
   , Task = require("./app/task").Task
   , mongoose = require("mongoose")


exports.app = seep.Application.extend({

	init: function() {
		this._super("Seep Tasks")
		
		mongoose.connect('mongodb://localhost/test');
		mongoose.model("Task", require("./app/task").TaskModel)
		var TaskModel = mongoose.model("Task")
		
		var title = new seep.Text("Seep Tasks")
		title.addStyle("title")
		this.add(title)
		
		this.layout = new seep.layout.Flow()
		this.layout.addStyle("notepad")
		this.add(this.layout)
		
		this.newTask = new seep.Input()
		this.newTask.placeholder = "Create new task..."
		this.newButton = new seep.Button("+")
		this.newButton.tooltip = "Create Task"
		
		this.newButton.addListener("click", function() {
			if(this.newTask.text) {
				this.layout.add(new Task(this.newTask.text), {index: 1, animate: true})
				this.newTask.text = ""
			}
		}, {bind: this})
		
		this.newTask.addListener("keydown", function(e) {
			if(e.keyCode==13) this.newButton.click()
			else if(e.keyCode==27) {
				this.newTask.text = ""
				e.preventDefault()
				//e.stopPropagation()
			}
		}, {bind: this, client: true})
		
		var newLayout = new seep.layout.Flow()
		newLayout.addStyle("add-task")
		
		newLayout.add(this.newTask)
		newLayout.add(this.newButton)
		this.layout.add(newLayout)
		
		this.layout.add(new Task("Add drag’n’drop for task sorting"))
		this.layout.add(new Task("Create a website on seepjs.org"))
		this.layout.add(new Task("Deploy to Duostack"))
		this.layout.add(new Task("Add iPhone/iPad stylesheets"))
		this.layout.add(new Task("Add a help button to the header and display keyboard controls"))
		this.layout.add(new Task("Add a cleanup button to the header (remove all completed tasks)"))
		this.layout.add(new Task("Add a trash can, with undo capability"))
		this.layout.add(new Task("Make these tasks persistent using MongoDB"))
		this.layout.add(new Task("Create a super-awesome, simple task manager app using Seep", true))
		
		this.newTask.addListener("keydown", function(e) {
			if(e.keyCode==40) {
				var next = this.layout.getWidget(1)
				if(next) next.focus()
			}
		}, {bind: this})
		
		
		newLayout.addListener("click", function() {
			this.newTask.focus()
		}, {bind: this, client: true})
		
	}
	
})