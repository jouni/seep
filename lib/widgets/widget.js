var Class = require("../class").Class
  , path = require("path")
  , util = require("../util")


var Widget = Class.extend({

		// Set of properties which are synchronized with the client
		// Each extending widget can add property names to the list
		// Each of these properties is synchronized between the server and the client, 
		// i.e. if the variable changes in the client, the server will get the change as well
		syncProps: ["visible"],
	
	init: function(filename) {
		this.id = undefined
		// Counter to increment if no ID is specified for a listener
		this.idCounter = 0
		this.parent = null
		this.basePath = path.dirname(__filename)
		this.dependencies = null
		this.styles = null
		this.dirty = true
		this.synching = true
		this.visible = true
		this.outBuffer = {sync: this.syncProps, visible: this.visible}
		
		this.setType(filename)
		
		for(var i=0; i < this.syncProps.length; i++) {
			var self = this
			var v = this.syncProps[i]
			this.watch(v, function(prop, old, val) {
				if(old != val && this.synching) {
					self.outBuffer[v] = val
					self.repaint() 
				}
				return val
			})
		}
	},
	
	syncProp: function(prop) {
		if(this.syncProps.indexOf(prop)===-1)
			this.syncProps.push(prop)
	},
	
	sync: function(allow) {
		this.synching = allow
	},
	
	setType: function(filename) {
		// Add dependency on the parent type
		if(this.type && this.type != "widget")
			this.dependsOn(this.type) 
			
		// Derive widget type from the filename passed over from inheriting class
		this.type = path.basename(filename.substr(this.basePath.length+1).replace("/","."), ".js");
		this.outBuffer.type = this.type
	},
	
	getType: function() {
		return this.type;
	},
	
	setParent: function(parent) {
		this.parent = parent;
	},
	
	getParent: function() {
		return this.parent;
	},
	
	setApplication: function(app) {
		this.application = app;
		if(app)
			this.application.registerWidget(this);
	},
	
	getApplication: function() {
		return this.application;
	},
	
	dependsOn: function(type) {
		if(!this.dependencies)
			this.dependencies = []
		this.dependencies.push(type)
	},
	
	addStyle: function(style) {
		if(!this.styles)
			this.styles = []
			
		if(this.styles.indexOf(style)===-1) {
			this.styles.push(style)
			
			if(!this.outBuffer.styles)
				this.outBuffer.styles = []
			this.outBuffer.styles.push(style)
			
			this.repaint()
		}
	},
	
	removeStyle: function(style) {
		if(!this.styles)
			return
			
		this.styles.splice(this.styles.indexOf(style), 1);
		
		if(this.styles.length==0)
			this.styles = null
		
		if(!this.outBuffer.styles)
			this.outBuffer.styles = []
		this.outBuffer.styles.push({style: style, remove: true})
		
		this.repaint()
	},
	
	/**
	 * returns the listenerId, either the one specified or a generated one
	 */
	addListener: function(type, listener, props) {
		// Arrays of objects: { t(ype), l(istener) [, id] }
		
		var p = props || {}
		
		if(!p.id) {
			p.id = this.idCounter++;
		}
		
		if(p.client) {
			listener = util.createClientListener(listener, p.bind)
		} else if(p.bind) {
			listener = util.createServerListener(listener, p.bind)
		}
		
		var listenerObj = {t: type, l: listener, id: p.id}
		
		if(!this.outBuffer.listeners)
			this.outBuffer.listeners = {}
		
		if(p.client) {
			if(!this.clientListeners)
				this.clientListeners = [];
			this.clientListeners.push(listenerObj);
			if(!this.outBuffer.listeners.client)
				this.outBuffer.listeners.client = []
			this.outBuffer.listeners.client.push(listenerObj)
		} else {
			if(!this.serverListeners)
				this.serverListeners = [];
			this.serverListeners.push(listenerObj);
			if(!this.outBuffer.listeners.server)
				this.outBuffer.listeners.server = {}
			if(!this.outBuffer.listeners.server[type])
				this.outBuffer.listeners.server[type] = 0
			this.outBuffer.listeners.server[type] += 1
		}
		
		this.repaint()
		
		return p.id
	},
	
	removeListener: function(id) {
		var listener
		var server = false
		if(this.serverListeners) {
			for(var i=0; i < this.serverListeners.length; i++) {
				if(this.serverListeners[i].id == id) {
					listener = this.serverListeners.splice(i, 1)[0]
					server = true
					break
				}
			}
		}
		if(!listener && this.clientListeners) {
			for(var i=0; i < this.clientListeners.length; i++) {
				if(this.clientListeners[i].id == id) {
					listener = this.clientListeners.splice(i, 1)[0]
					break
				}
			}
		}
		
		if(!listener)
			return

		if(!this.outBuffer.listeners)
			this.outBuffer.listeners = {}
		if(server) {
			if(!this.outBuffer.listeners.server)
				this.outBuffer.listeners.server = {}
			if(!this.outBuffer.listeners.server[listener.t])
				this.outBuffer.listeners.server[listener.t] = 0
			this.outBuffer.listeners.server[listener.t] -= 1
		} else {
			if(!this.outBuffer.listeners.client)
				this.outBuffer.listeners.client = []
			this.outBuffer.listeners.client.push({id: id, t: listener.t, remove: true})
		}
		
		this.repaint()
	},
	
	fireEvent: function(event) {
		for(var i=0; i < this.serverListeners.length; i++) {
			if(this.serverListeners[i].t == event.type) {
				event.source = this
				this.serverListeners[i].l.call(this, event)
			}
		}
	},
	
	repaint: function(recurse, delay) {
		this.dirty = true
		if(recurse) {
			// Full repaint needed (most likely the client has reloaded the browser)
			this.outBuffer.sync = this.syncProps
			this.outBuffer.type = this.type
			this.outBuffer.visible = this.visible
			if(this.styles)
				this.outBuffer.styles = this.styles.slice()
			if(this.clientListeners) {
				if(!this.outBuffer.listeners)
					this.outBuffer.listeners = {}
				this.outBuffer.listeners.client = this.clientListeners.slice()
			}
			if(this.serverListeners) {
				if(!this.outBuffer.listeners)
					this.outBuffer.listeners = {}
				this.outBuffer.listeners.server = {}
				for(var i=0; i < this.serverListeners.length; i++) {
					if(!this.outBuffer.listeners.server[this.serverListeners[i].t])
						this.outBuffer.listeners.server[this.serverListeners[i].t] = 0
					this.outBuffer.listeners.server[this.serverListeners[i].t] += 1
				}
			}
			for(var i=0; i < this.syncProps.length; i++)
				this.outBuffer[this.syncProps[i]] = this[this.syncProps[i]]
		}
		
		if(this.getParent() && this.getParent().needsRepaint())
			this.getParent().repaint()
			
		if(!recurse && this.application) {
			this.application.pushChanges()
		}
	},
	
	needsRepaint: function() {
		return this.dirty
	},

	serialize: function() {
		if(this.needsRepaint()) {
			var out = this.outBuffer;
			out.id = this.id
			this.outBuffer = {}
			this.dirty = false
			return out
		}
		return null
	}
    
});


Widget.prototype.watch = function (prop, handler) {
    var oldval = this[prop], newval = oldval,
    getter = function () {
        return newval;
    },
    setter = function (val) {
        oldval = newval;
        return newval = handler.call(this, prop, oldval, val);
    };
    if (delete this[prop]) { // can't watch constants
		Widget.prototype.__defineGetter__.call(this, prop, getter);
		Widget.prototype.__defineSetter__.call(this, prop, setter);
    }
};


Widget.prototype.unwatch = function (prop) {
    var val = this[prop];
    delete this[prop]; // remove accessors
    this[prop] = val;
};


exports.Widget = Widget

