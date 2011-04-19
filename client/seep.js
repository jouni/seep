// Singleton class
if(typeof seep === "undefined") {

var seep = (function(){

	// Decide if we're in the server or not
	var server = false,
	     settings
	  if (typeof exports !== "undefined") {
	    settings = exports
	    server = true
	  } else {
	    settings = this.settings = {}
	  }
	 
	if(!server) {
		var console = window.console;
		if (!console || !console.log || !console.error) {
			console = {log: function(){ }, error: function(){ }};
		}
		
		// TODO see how we could determine across applications whether 
		// the type is loaded or not and block execution accordingly
		//$LAB.setGlobalDefaults({AllowDuplicates: false});
	}
	
	// Used for initializing the application and reconnecting after a socket disconnect
	settings.MESSAGE_INIT = "init"
	
	var applications = {};	
	
	// Public interface
	return {
		init: function(appPath, appId) {
			if(typeof appId === "boolean")
				appId = appPath
	    	setTimeout(function() {
			    new seep.application(appPath, appId);
			}, 0);
		},
		
		getApplication: function(id) {
			return applications[id]
		},
		
		addApplication: function(app) {
			applications[app.id] = app
		},
		
		// Only accepts the root element of a Seep widget, not contained elements
		getWidget: function(el) {
			if(el.__seepId) {
				// Find the application root element and its id
				var p = el.parentNode
				while(p.className.indexOf("seep-app") < 0) {
					p = p.parentNode
				}
				return seep.getApplication(p.__seepId).getWidgetById(el.__seepId)
			}
			console.warn("No Seep widget found for element", el)
			return null
		},
		
		createCookie: function(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		
		readCookie: function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		
		eraseCookie: function(name) {
			createCookie(name,"",-1);
		}
	}

})();

/**********************************************************
 * Seep application class
 **********************************************************/
seep.application = function(appPath, elementId) {
	
	this.applicationWidgets = {}
	
	this.rootElement = elementId? document.getElementById(elementId) : document.body
	this.rootElement.className += (this.rootElement.className.length>0? " " : "") + "seep-app"
	this.path = appPath
	
	var self = this;

	this.conn = new io.Socket()
	
	this.conn.on('connect', function() {
		console.log("Application connected ('"+appPath+"', "+this.transport.sessionid+"), requesting widgets...")
		// A small delay is needed in order for the websocket to initialize before it can receive messages (noticed during testing and this seems to cure the problem robustly)
		setTimeout(function() {
			self.conn.send({message: settings.MESSAGE_INIT, path: appPath, sid: seep.readCookie("seep.sid") })
		}, 10)
	}) 
	this.conn.on('message', function(data) {
		if(data.sid) {
			console.log("New sid", data.sid)
			// TODO make the timeout configurable
			seep.createCookie("seep.sid", data.sid, 1)
		}
		// TODO keep the cookie alive if the application is used
		self.update(data)
		console.log("App (id:" + self.id + ") updated", data)
	})
	this.conn.on('close', function() {
		console.log("Application (id:" + self.id + ") closed")
	})
	this.conn.on('disconnect', function() {
		console.log("Application (id:" + self.id + ") disconnected")
		// TODO server down? connection breaking?
		// TODO need to clear the application from the DOM, make a full refresh
		//this.connect()
	})
	
	// Start the application
	console.log("Starting application for path '" + appPath)
	this.conn.connect()
	
	this.update = function(json) {
		this.id = json.id
		if(!seep.getApplication(this.id)) {
			seep.addApplication(this)
			this.rootElement.__seepId = this.id
			this.rootElement.innerHTML = ""
		}
			
		if(json.types) {
			var load = []
	    	for(var i=0; i < json.types.length; i++) {
	    		load.push("widgets/" + json.types[i].replace(/\./g, "/") + ".js")
	    	}
	    	var self = this;
	    	$LAB.setOptions({AlwaysPreserveOrder:true}).script(load).wait(function() {
	    		self.processWidgetChanges(json.widgets)
	    	})
		} else {
			this.processWidgetChanges(json.widgets)
		}
	}
	    
	this.processWidgetChanges = function(widgets) {
		if(!widgets)
			return
	    for(var i=0; i < widgets.length; i++) {
	        var json = widgets[i];
	        var widget = this.getWidget(json);
	        if(widget) {
	            widget.update(json);
	            if(widget.element.parentNode == null) {
	            	this.getElement().appendChild(widget.element)
	            	widget.updateSize()
	            }
	        } else {
	        	console.log("No widget found for JSON", json)
	        }
	    }
	}
	
	this.getWidget = function(json) {
		var widget = this.getWidgetById(json.id)
	    if(!widget && json.type) {
	    	if(json.type.indexOf(".")>0) {
	    		var types = json.type.split(".")
	    		var constr = seep[types[0]]
	    		for(var i=1; i < types.length; i++) {
	    			constr = constr[types[i]]
	    		}
	    	} else {
	    		var constr = seep[json.type]
	    	}
	    	if(typeof constr == "undefined") {
	    		console.log("Oops, something went wrong and the widget prototype for "+json.type+" is not defined")
	    		return null
	    	}
	    	widget = new constr(json)
	    	this.applicationWidgets[json.id] = widget
	    	widget.application = this
	    } else if(!widget) {
	    	console.error("Failed to initialize a widget (no type specified?)", json)
	    }
	    return widget
	}
	
	this.getWidgetById = function(id) {
		return this.applicationWidgets[id]
	}
	
	this.unregister = function(id) {
		this.applicationWidgets[id] = null
		delete this.applicationWidgets[id]
	}
		
	this.getElement = function() {
		return this.rootElement
	}
	
	// FIXME create a buffer for these messages that queue up and are handled in the correct order in the server
	
	this.sendEvent = function(widgetId, type, event) {
		var message = {message: "event", id: widgetId}
		var send = ["altKey", "charCode", "clientX", "clientY", "ctrlKey", "data", "detail", "keyCode", "layerX", "layerY", "metaKey", "offsetX", "offsetY", "pageX", "pageY", "screenX", "screenY", "shiftKey", "wheelDelta", "which"]
		var eventObj = {}
		for(var i=0; i < send.length; i++)
			eventObj[send[i]] = event[send[i]]
		eventObj.type = type
		message.event = eventObj
		console.log("Sending event", message)
		this.conn.send(message);
	},
	
	// Sync messages can be lazy, unless specially requested to be immediate
	
	this.sync = function(widgetId, prop, val) {
		var message = {message: "sync", id: widgetId, prop: prop, val: val}
		console.log("Synching", message)
		this.conn.send(message)
	}
	
}

/**********************************************************
 * Core widget class
 **********************************************************/
Function.prototype.inherit = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) { 
		// Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} else { 
		// Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	}
}

seep.widget = function(json) {
	if(!json)
		return // inheriting, no need to initialize further
		
    this.type = json.type
	this.parent = null
	this.application = null
	this.element = document.createElement(json.elementType? json.elementType : "div")
    this.element.className = "s-" + json.type.replace(/\./g, "-")
	this.id = this.element.__seepId = json.id;
	this.synching = true
	
	if(json.sync) {
		for(var i=0; i < json.sync.length; i++) {
			var self = this
			this.watch(json.sync[i], function(prop, old, val) {
				if(prop=="visible") {
					self.element.style.display = val ? "" : "none"
				} else if(prop=="width") {
					self.element.style.width = val
					self.sync(true)
					self.pixelWidth = self.element.offsetWidth
					self.sync("pixelWidth", "", self.element.offsetWidth)
					self.sync(false)
				} else if(prop=="height") {
					self.element.style.height = val
					self.sync(true)
					self.pixelHeight = self.element.offsetHeight
					self.sync("pixelHeight", "", self.element.offsetHeight)
					self.sync(false)
				}
				self.sync(prop, old, val)
				return val
			})
		}
	}
}

seep.widget.prototype.sync = function() {
	if(arguments.length==1)
		this.synching = arguments[0]
	else {
		var prop = arguments[0]
		var old = arguments[1]
		var val = arguments[2]
		var self = this
		if(typeof old != "undefined" && old != val && this.synching)
			self.application.sync(self.id, prop, val)
	}
}

seep.widget.prototype.update = function(json) {	
	this.sync(false)
	
	if(typeof json.visible != "undefined")
		this.visible = json.visible
	
	if(json.tooltip)
		this.element.title = json.tooltip
	
	if(json.width)
		this.width = json.width
	
	if(json.height)
		this.height = json.height

    if(json.styles) {
    	for(var i=0; i < json.styles.length; i++) {
    		var style = json.styles[i]
    		if(typeof style == "string")
    			$(this.element).addClass(style)
    		else if(style.remove) {
    			$(this.element).removeClass(style.style)
    		}
    	}
    }
    
    if(json.listeners) {
    	if(json.listeners.server) {
    		for(var type in json.listeners.server) {
    			if(json.listeners.server[type] < 0)
    			    $(this.element).unbind(type+".server")
    			else
    			    $(this.element).bind(type+".server", function(event) {
    			    	var w = seep.getWidget(this)
    			    	w.application.sendEvent(w.id, type, event);
    				});
    		}
    	}
    	if(json.listeners.client) {
    		for(var i=0; i <  json.listeners.client.length; i++) {
    			var listenerObj = json.listeners.client[i]
    			var type = listenerObj.t
    			var id = listenerObj.id
    			if(listenerObj.remove) {
    				$(this.element).unbind(type+".id"+id)
    			} else {
    				var fn = "" + listenerObj.l
    				$(this.element).bind(type+".id"+id, function(event) {
    					var func = new Function(fn)
    					event.source = seep.getWidget(this)
    					func.call(this, event)
    				});
    			}
    		}
    	}
    }
    
    this.sync(true)
}

seep.widget.prototype.updateSize = function() {
	this.pixelWidth = this.element.offsetWidth
	this.pixelHeight = this.element.offsetHeight
	this.sync("pixelWidth", "", this.pixelWidth)
	this.sync("pixelHeight", "", this.pixelHeight)
}

seep.widget.prototype.watch = function (prop, handler) {
    var oldval = this[prop], newval = oldval,
    getter = function () {
        return newval;
    },
    setter = function (val) {
        oldval = newval;
        return newval = handler.call(this, prop, oldval, val);
    };
    if (delete this[prop]) { // can't watch constants
       if (seep.widget.defineProperty) // ECMAScript 5
            seep.widget.defineProperty(this, prop, {
                get: getter,
                set: setter
            });
       else if (seep.widget.prototype.__defineGetter__ && seep.widget.prototype.__defineSetter__) { // legacy*/
            seep.widget.prototype.__defineGetter__.call(this, prop, getter);
            seep.widget.prototype.__defineSetter__.call(this, prop, setter);
        }
    }
};

seep.widget.prototype.unwatch = function (prop) {
    var val = this[prop];
    delete this[prop]; // remove accessors
    this[prop] = val;
};



}