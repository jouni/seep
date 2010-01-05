var Class = require("../external/class").Class;
var sys = require("sys");

exports.Widget = Class.extend({
	
	// Counter to increment if no ID is specified for a listener
	idCounter: 0,
	
	init: function() {
		// nothing to do
	},
	
	getType: function() {
		if(typeof this.type == "undefined") {
			sys.puts("ERROR: No type specified for widget");
			this.type = "unknown_widget";
		}
		return this.type;
	},
	
	setParent: function(parent) {
		this.parent = parent;
	},
	
	setApplication: function(app) {
		this.application = app;
		this.application.addWidgetInUse(this);
		this.repaint();
	},
	
	/**
	 * returns the listenerId, either the one specified or a generated one
	 */
	addListener: function(type, listener, listenerId) {
		// Arrays of objects: { t(ype), l(istener) [, id] }
		if(!listenerId) {
			listenerId = this.idCounter++;
		}
		if(typeof listener == "string") {
			if(!this.clientListeners)
				this.clientListeners = new Array();
			this.clientListeners.push({t: type, l: listener, id: listenerId});
		} else {
			if(!this.listeners)
				this.listeners = new Array();
			this.listeners.push({t: type, l: listener, id: listenerId});
		}
		return listenerId;
	},
	
	repaint: function() {
		this.dirty = true;
		if(this.parent)
			this.parent.repaint();
	},
	
	needsRepaint: function() {
		return this.dirty;
	},

	serialize: function(out) {
		if(this.needsRepaint()) {
			out.id = this.id;
			out.type = this.getType();
			out.listeners = this.clientListeners;
		}
		return out;
	}
    
});