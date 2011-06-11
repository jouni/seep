var Class = require("./class").Class
  , Settings = require("./settings")
  , util = require("./util")

// appId & widgetId are global to this server, i.e. no app or widget has ever the same id number
var appId = 0;
var widgetId = 0;

exports.Application = Class.extend({

	__seepApp: true,
	
	pushBufferTimeout: 50,

	init: function(name) {
		if(typeof name != 'undefined')
			this.name = name;
		this.widgets = [];
		this.applicationWidgets = {};
		this.widgetsInUse = {};
		this.widgetsToSend = null;
		this.id = appId++;
		this.connection = null;
	},

	getName: function() {
		return this.name;
	},

	getPath: function() {
		return this.path;
	},

	setPath: function(path) {
		this.path = path;
	},
	
	setDocRoot: function(root) {
		this.docRoot = root;
	},
	
	getWidgetById: function(id) {
		return this.applicationWidgets[id];
	},
	
	add: function(widget) {
		this.widgets.push(widget);
		// Widgets directly inside application have no parent
		widget.setParent(null);
		widget.setApplication(this);
		this.repaint();
	},
	
	registerType: function(type) {
		if(!this.widgetsInUse[type]) {
			if(!this.widgetsToSend)
				this.widgetsToSend = {};
			this.widgetsToSend[type] = true;
		}
		this.widgetsInUse[type] = true;
	},
	
	registerWidget: function(widget) {
		if(widget.dependencies) {
			for(var i=0; i < widget.dependencies.length; i++) {
				this.registerType(widget.dependencies[i])
			}
		}
		this.registerType(widget.getType())
		if(!widget.id) {
			widget.id = ++widgetId
		}
		widget.repaint(true)
		this.applicationWidgets[widget.id] = widget
	},
	
	unregisterWidget: function(widget) {
		// TODO can we somehow check what types are still in use? Loop through applicationWidgets?
		widget.setApplication(null)
		widget.setParent(null)
		this.applicationWidgets[widget.id] = null
		delete this.applicationWidgets[widget.id]
	},
	
	focus: function(widget) {
		this.focused = widget.id
		this.repaint()
	},
	
	setConnection: function(conn) {
		this.connection = conn
		var self = this;
		conn.on("message", function(data) {
			console.log(new Date(data.time), "- App("+self.id+") received messages", data)
			self.processUpdate(data)
		})
		this.repaint(true)
	},
	
	repaint: function(recurse) {
		if(recurse) {
			this.widgetsToSend = {};
			for(var type in this.widgetsInUse) {
				this.widgetsToSend[type] = true;
			}
			for(var i=0; i < this.widgets.length; i++) {
				this.widgets[i].repaint(recurse);
			}
		}
		this.pushChanges()
	},
	
	getDirtyWidgets: function() {
		var dirty = [];
		for(var id in this.applicationWidgets) {
			var widget = this.applicationWidgets[id];
			if(widget.needsRepaint()) {
				if(widget.getParent() && !widget.getParent().needsRepaint()) {
					dirty.push(widget);
				} else if(!widget.getParent()) {
					dirty.push(widget);
				}
			} 
		}
		return dirty;
	},

	serialize: function() {
		var out = {}
	  	out.id = this.id
	  	if(typeof this.name != 'undefined')
	  		out.name = this.name
	  	
		if(this.widgetsToSend) {
			out.types = []
			for(var type in this.widgetsToSend) {
				out.types.push(type)
			}
			this.widgetsToSend = null
		}
		
		out.widgets = []
		
		// We need to parse the client handlers before they are sent to the client
		// Dirty set might change since client listeners might introduce new syncProps
		for(var id in this.applicationWidgets) {
			var widget = this.applicationWidgets[id];
			util.serializeClientListeners(widget)
		}
		
		var dirty = this.getDirtyWidgets()
		
		for(var i=0; i < dirty.length; i++) {
			out.widgets.push(dirty[i].serialize())
		}
		
		if(this.focused) {
			out.focused = this.focused
			this.focused = null
		}
		
		return out;
	},
	
	_pushTimer: null,
	
	pushChanges: function(delay) {
		if(this.connection) {
			if(this._pushTimer)
				clearTimeout(this._pushTimer)
			var timer = delay || this.pushBufferTimeout
			var self = this
			this._pushTimer = setTimeout(function() {
				console.log("Pushing update (id, connection id) (", self.id, ",", self.connection.sessionId, ")")
				self.connection.send(self.serialize())
				clearTimeout(self._pushTimer)
			}, timer)
		} else {
			console.warn("Trying to push changes for application with no connection", this.id)
		}
	},
	
	processUpdate: function(data) {
		var messages = data.messages
		
		// Sync all properties first
		if(messages.sync) {
			for(var id in messages.sync) {
				var props = messages.sync[id]
				var widget = this.getWidgetById(id)
				for(var prop in props) {
					var pullProps = {"pixelWidth": true, "pixelHeight": true}
					if(widget && (pullProps[prop] || widget.syncProps[prop])) {
						console.log("Synching property for widget", id, ":", prop, ":", props[prop], "for application id", this.id)
						widget.sync(false)
						if(prop=="styles") {
							widget.styles = props[prop].split(" ")
						} else {
							widget[prop] = props[prop]
						}
						widget.sync(true)
					} else {
						console.error("Widget tried to sync a property that is not allowed to sync ("+prop+")")
					}
				}
			}
		}
		
		if(messages.events) {
			for(var i=0; i < messages.events.length; i++) {
				var event = messages.events[i]
				console.log("Event received for widget", event.id, ":", event.type, "for application id", this.id)
				var widget = this.getWidgetById(event.id)
				// FIXME make sure the widget is active and attached and make some other save-guard checks
				if(widget) {
					delete event.id
					widget.fireEvent(event)
				}
			}
		}
	}

});