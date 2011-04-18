var seep = require("seep");

var app = seep.Application.extend({

	hello: null,
	layout: null,
	test: null,
	bn: null,
	input: null,
	remove: null,

	init: function() {
		this._super("My app");
		
		// widgets need to be added to the application before they can have client listeners (widget must have an id before it can be triggered on the client)
		
		this.layout = new seep.layout.Flow({wrap: "div.mystyle.foobar"});
		this.add(this.layout);
		
		this.hello = new seep.Text("Hello ");
		this.layout.add(this.hello);
		this.hello.addListener("mouseover", function() {
			this.hello.addStyle("hovered")
			this.hello.text = "Hovered"
		}, {bind: this, id: "hover"})
		
		this.input = new seep.Input("World!")
		this.layout.add(this.input);
		this.input.addListener("focus", function(e) {
			this.input.text="";
		}, {bind: this, client: true, id: "focus"})
		
		this.bn = new seep.Button("My Button");
		button = this.bn
		this.layout.add(button);
		
		button.addListener("click", function(e) {
			this.bn.text=e.altKey? "Alt" : "No alt"
			this.hello.text = "Waiting for server to change me..."
		}, {bind: this, client: true});
		
		button.addListener("click", function(event) {
			this.hello.removeStyle("hovered")
			
			var self = this;
			setTimeout(function(){
				self.bn.text="Back from server";
				self.hello.text = "Hello from the server again "
				self.input.text=event.shiftKey? "Shift was pressed" : "No shift pressed"
			}, 1000)
		}, {bind: this});
		
		var add = new seep.Button("Add");
		add.addListener("click", function() {
			this.layout.add(new seep.Text("Label " + this.layout.count()))
			this.remove.disabled = false
			this.input.removeListener("focus")
		}, {bind: this})
		this.layout.add(add)
		
		var remove = new seep.Button("Remove");
		remove.addListener("click", function() {
			if(this.layout.count() > 5)
				this.layout.remove(this.layout.count()-1)
			if(this.layout.count()==5)
				this.remove.disabled = true
		}, {bind: this})
		this.layout.add(remove)
		remove.disabled = true
		this.remove = remove
		
		//layout.addListener("load", function(){alert("layout loaded");}.runInClient());
		
	}

});


exports.foobar = app;