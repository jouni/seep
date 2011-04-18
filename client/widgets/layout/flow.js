if(typeof seep.layout == "undefined")
	seep.layout = {}

seep.layout.flow = function(json) {
	if(!json)
		return
		
	seep.widget.call(this, json)
    this.wrap = json.wrap
}

seep.layout.flow.inherit(seep.widget)

seep.layout.flow.prototype.update = function(json) {
    seep.widget.prototype.update.call(this, json);
    
    if(json.widgets) {
		for(var i=0; i < json.widgets.length; i++) {
			var widgetJson = json.widgets[i];
			
			if(!widgetJson)
				continue // no change for this widget slot
			
			if(widgetJson.removed) {
				var el = this.application.getWidgetById(widgetJson.id).element
				this.element.removeChild(this.wrap? el.parentNode: el)
				this.application.unregister(widgetJson.id)
				continue
			}
			
			var widget = this.application.getWidget(widgetJson);
			if(!widget)
				continue
			widget.update(widgetJson)
			if(widget.parent != this) {
				widget.parent = this
				var el = widget.element;
				if(this.wrap) {
					var wrap = this.wrap.split(".")
					var el = document.createElement(wrap[0])
					if(wrap.length >= 2)
						el.className = wrap.splice(1,wrap.length-1).join(" ")
					el.appendChild(widget.element)
				} 
				this.element.appendChild(el);
			}
		}
	}
}