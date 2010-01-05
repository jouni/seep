var Class = require("./external/class").Class;
var sys = require("sys");
var posix = require("posix");

var appId = 0;
var widgetId = 0;

exports.Application = Class.extend({

	init: function(name){
		if(typeof name == 'undefined')
			this.name = "unnamed-seep-application";
		else
			this.name = name;
		this.widgets = new Array();
		this.applicationWidgets = {};
		this.widgetsInUse = {};
		this.widgetsToSend = null;
		this.id = appId++;
	},

	getSeepName: function(){
		return this.name;
	},

	getPath: function(){
		return this.path;
	},

	setPath: function(path){
		this.path = path;
	},
	
	setDocRoot: function(root) {
		this.docRoot = root;
	},
	
	setClientPackages: function(packages) {
		this.clientPackages = packages;
	},
	
	getWidgetById: function(id) {
		return this.applicationWidgets[id];
	},
	
	add: function(widget) {
		this.widgets.push(widget);
		// Widgets directly inside application have no parent
		widget.setParent(null);
		widget.setApplication(this);
		
	},
	
	addWidgetInUse: function(widget) {
		var type = widget.getType();
		if(!this.widgetsInUse[type]) {
			sys.puts("Widget in use: "+type);
			if(!this.widgetsToSend)
				this.widgetsToSend = {};
			this.widgetsToSend[type] = true;
		}
		this.widgetsInUse[type] = true;
		if(!widget.id) {
			widget.id = widgetId++;
			this.applicationWidgets[widget.id] = widget;
		}
	},
	
	repaint: function() {
		this.widgetsToSend = {};
		for(var type in this.widgetsInUse) {
			this.widgetsToSend[type] = true;
		}
	},

	serialize: function() {
		var out = {};
		if(this.widgetsToSend) {
			out.types = new Array();
			for(var type in this.widgetsToSend) {
				if(type.indexOf("seep")===0) {
					out.types.push(this.clientPackages[type]);
				}
			}
			this.widgetsToSend = null;
		}
		
		var w = [];
		for(var i=0; i < this.widgets.length; i++) {
		    w.push(this.widgets[i].serialize({}));
		}
	  	out.widgets = w;
	  	out.path = this.path;
	  	out.id = this.id;
		
		return JSON.stringify(out).replace(/\"/g,"\\\"").replace(/\\\\\"/g,"\\\\\\\"");
	}

});