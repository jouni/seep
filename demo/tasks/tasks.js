var seep = require("seep")
  , Task = require("./app/task").Task
//  , TaskModel = require("./app/task").TaskModel
//  , mongoose = require("mongoose")


exports.app = seep.Application.extend({

	init: function() {
		this._super("Seep Tasks")
		//mongoose.connect('mongodb://localhost/test');
		//mongoose.model("Task", TaskModel)
		//var TaskModel2 = mongoose.model("Task")
		
		//var testTask = new TaskModel2();
		//testTask.title = "Test task"
		//testTask.save()
		
		this.layout = new seep.layout.Flow()
		this.layout.addStyle("notepad")
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
			else if(e.keyCode==27) this.newTask.text = ""
		}, {bind: this, client: true})
		
		var newLayout = new seep.layout.Flow()
		newLayout.addStyle("add-task")
		
		newLayout.add(this.newTask)
		newLayout.add(this.newButton)
		this.layout.add(newLayout)
		
		this.layout.add(new Task("Create a super-awesome, simple task manager app using Seep"))
		
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