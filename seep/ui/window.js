var Widget = require("./widget").Widget;
var layout = require("./layout");
var sys = require("sys");

exports.Window = Widget.extend({

	type: "seep.ui.window",

	layout: new layout.Flow(),

	init: function(title){
		this._super();
		this.title = title;
	},
	
	getTitle: function() {
		return this.title;
	},

	serialize: function(out) {
		this._super(out);
		out.title = this.title;
		out.l = this.layout.serialize({});
		return out;
	},
	
	add: function(c) {
		this.layout.add(c);
	}
    
});