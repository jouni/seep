var seep = require("seep")

exports.app = seep.Application.extend({

	// Everything you define here, before init, will be static, 
	// i.e. available equally to all instances of this same application
	// A great way to make a chat for instance

	init: function() {
		this._super("Hello World!")
		this.add(new seep.Text("Hello World!")) 
	}
	
})