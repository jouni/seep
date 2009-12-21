var c = require("../external/class");
var Flow = require("./layout/flow").Flow;
var sys = require("sys");
exports.Window = c.Class.extend({

	layout: new Flow(),

	init: function(title){
		this.title = title;
	},
	
	getTitle: function() {
		return this.title;
	},

	serialize: function() {
		return {
			t: this.title,
			l: this.layout.serialize()
		};
	},
	
	add: function(c) {
		this.layout.add(c);
	}
    
});