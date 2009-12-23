var w = require("./widget");
var layout = require("./layout");

exports.Window = w.Widget.extend({

	layout: new layout.Flow(),

	init: function(title){
		this.title = title;
	},
	
	getTitle: function() {
		return this.title;
	},

	serialize: function() {
		var super = this._super();
		super.type = "window";
		super.title = this.title;
		super.l = this.layout.serialize();
		return super;
	},
	
	add: function(c) {
		this.layout.add(c);
	}
    
});