var seep = require("../seep");
var sys =  require("sys");

var app = seep.Application.extend({

	init: function() {
		this._super("My app");
		
		var layout = new seep.ui.layout.Flow();
		
		layout.add(new seep.ui.Text("Hello"));
		layout.add(new seep.ui.Text("World!"));
		
		var button = new seep.ui.Button("My button");
		button.addListener("click", function() {alert("clicked");}.runInClient());
		button.addListener("click", function() {alert("clicked again");}.runInClient());
		layout.add(button);
		
		//layout.addListener("load", function(){alert("layout loaded");}.runInClient());
		
		this.add(layout);
		
		setTimeout(function(){layout.addListener("foobar", function(){alert("lazy-loaded listener");}.runInClient());}, 10000);
	}

});


exports.foobar = app;