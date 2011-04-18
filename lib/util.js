// Utility and helper functions for Seep

/**
 * Stringify the listener function to be sent over to the client
 */
exports.createClientListener = function(fn, context) {
	if(!context) {
		console.error("You need to specify the context for a client side listener")
		return "";
	}
	
	// Get the string presentation for the method, strip tabs (less stuff to send over the wire)
	var s = fn.toString().replace(/[\t]/g, "");
	
	// Find the possible event object name if the developer has specified that
	var end = s.indexOf(",")===-1? s.indexOf(")") : Math.min(s.indexOf(")"), s.indexOf(","))
	var eventObjName = s.substring(s.indexOf("(")+1, end)
	
	// Strip "function() {" from the beginning and the last "}" (again, less to send)
	s = s.substring(s.indexOf("{")+1, s.lastIndexOf("}"));
	
	// Find and replace Seep widget references with client side findable indexes
	// TODO make this more robust, now only supports simple references i.e. 'this.widget'
	var i = 0;
	while((i = s.indexOf("this.", i)) >= 0) {
		var end = s.indexOf(".", i+5);
		var temp = new Function("return "+s.substring(i, end)+";");
		var possibleWidget = temp.call(context);
		if(possibleWidget.type && possibleWidget.id) {
			s = s.substring(0, i) + "seep.getApplication("+possibleWidget.getApplication().id+").getWidgetById("+possibleWidget.id+")" + s.substring(end);
		}
		i = i+5;
	}
	
	// Prepend with client side event data if the developer has intensions to use it
	if(eventObjName.length > 0)
		s = "var " + eventObjName + " = arguments[0]; " + s;
	
	return s;
}


/**
 * Simply bind the funtion to it's context scope
 */
exports.createServerListener = function(fn, context) {
	return function(event) {
		fn.call(context, event);
	}
}