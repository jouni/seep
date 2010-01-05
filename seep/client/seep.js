// Singleton class
var seep = (function(){
	
	// Private members
	////////////////////////////
	
	var widgetsLoading = 0;
	var unprocessedChanges;
	
	var path = undefined;
	
	var applicationWidgets = {};
	
	function getWidget(json) {
		var widget = getWidgetById(json.id);
	    if(!widget && json.type)
	    	widget = eval("new "+json.type.replace(/\./g,"_")+"()");
	    return widget;
	}
	
	function getWidgetById(id) {
		return applicationWidgets[id];
	}
	
	var init = function(json) {
	    unprocessedChanges = json_parse(json);
	    console.log(unprocessedChanges);
	    
	    path = unprocessedChanges.path;
	    
	    if(unprocessedChanges.types) {
	    	widgetsLoading = unprocessedChanges.types.length;
	    	for(var i=0; i < unprocessedChanges.types.length; i++) {
	    		var type = unprocessedChanges.types[i];
	    		$LAB.script(type);
	    	}
	    } else {
	    	processWidgetChanges();
	    }
	    
	    
	}
	
	init(window.seepinit);
	    
	function processWidgetChanges() {
	    if(unprocessedChanges.widgets) {
	    	for(var i=0; i < unprocessedChanges.widgets.length; i++) {
	    		var json = unprocessedChanges.widgets[i];
	    		var widget = getWidget(json);
	    		if(widget) {
	    			delete json.type;
	    			widget.update(json);
	    		}
	    	}
	    }
	}
	
	
	// Public interface
	////////////////////////////
	return {
		widgetLoaded: function() {
			widgetsLoading--;
			if(widgetsLoading == 0) {
	    		console.log("[SEEP] Finished loading widget classes");
				processWidgetChanges();
			}
		},
		
		getPath: function() {
			return path;
		},
		
		getWidgetById: function(id) {
			return getWidgetById(id);
		},
		
		getWidget: function(json) {
			return getWidget(json);
		}
	}

})();