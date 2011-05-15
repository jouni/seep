// Utility and helper functions for Seep

/**
 * Stringify the listener function to be sent over to the client
 */
exports.createClientListener = function(fn, context) {
	if(!context) {
		console.error("You need to specify the context for a client side listener")
		return "";
	}
	
	// Get the string presentation for the method, strip beginning whitespace on each line (less stuff to send over the wire)
	var s = fn.toString().replace(/^[\s]+/gm, "");
	
	// Find the possible event object name if the developer has specified that
	var end = s.indexOf(",")===-1? s.indexOf(")") : Math.min(s.indexOf(")"), s.indexOf(","))
	var eventObjName = s.substring(s.indexOf("(")+1, end)
	
	// Strip "function() {" from the beginning and the last "}" (again, less to send)
	s = s.substring(s.indexOf("{")+1, s.lastIndexOf("}"));
	
	// Find and replace Seep widget references with client side findable indexes
	var reg = /(^|[!()+-=\s]*)(this\.[\w\.]*)([()+-=;\s]+|$)/m
	while(reg.lastIndex < s.length) {
		var m = reg.exec(s)
		if(!m)
			break
		var items = m[2].split(".")
		for(var i = items.length; i > 0; i--) {
		    var obj = items.slice(0, i).join(".");
		    var temp = new Function("return "+ obj +";");
		    try {
		    	var possibleWidget = temp.call(context);
		    	if(possibleWidget && possibleWidget.type && possibleWidget.id) {
		    		var seepGetString = "seep.get("+possibleWidget.getApplication().id+","+possibleWidget.id+")"
		    		s = s.substring(0, m.index + m[1].length) + seepGetString + s.substring(m.index+m[1].length+ obj.length)
		    		
		    		// Add sync props
		    		if(possibleWidget.pushProps[items.slice(i).join(".")] && m[3].indexOf("=") > -1) {
		    			possibleWidget.syncProp(items.slice(i).join("."))
		    		}
		    		
		    		reg.lastIndex = m.index = m.index + m[1].length + seepGetString.length + 1
		    		i = -1; // Break
		    	}
		    } catch(e) {
		    	// NOP
		    }
		}
		reg.lastIndex = m.index = m.index + m[0].length + 1
	}
	
	// Prepend with client side event data if the developer has intensions to use it
	if(eventObjName.length > 0)
		s = "var " + eventObjName + " = arguments[0]; " + s;
	
	return s.trim();
}


/**
 * Called just before widgets are serialized to be sent over to the client
 */
exports.serializeClientListeners = function(widget) {
	if(widget.outBuffer.listeners && widget.outBuffer.listeners.client) {
		var temp = []
		for(var i=0; i < widget.outBuffer.listeners.client.length; i++) {
		    var listenerObj = widget.outBuffer.listeners.client[i]
		    var toClient = {t: listenerObj.t, id: listenerObj.id}
		    if(listenerObj.remove)
		    	toClient.remove = true
		    else
		    	toClient.l = this.createClientListener(listenerObj.l, listenerObj.bind)
		    temp[i] = toClient
		}
		widget.outBuffer.listeners.client = temp
	}
}


/**
 * Simply bind the funtion to its context scope
 */
exports.createServerListener = function(fn, context) {
	return function(event) {
		fn.call(context, event);
	}
}