if(typeof seep.layout == "undefined")
	seep.layout = {}

seep.layout.flow = function(json) {
	if(!json)
		return
		
	seep.widget.call(this, json)
    this.wrap = json.wrap
    
    this.lazyAttach = []
}

seep.layout.flow.inherit(seep.widget)

seep.layout.flow.prototype.update = function(json) {
    seep.widget.prototype.update.call(this, json);
    
    if(json.widgets) {
    	var removed = {}
		
		for(var i=0; i < json.widgets.length; i++) {
			var widgetJson = json.widgets[i]
			
			if(widgetJson.remove) {	
				var w = this.application.getWidgetById(widgetJson.id)
				removed[w.id] = w
				this.element.removeChild(this.wrap? w.element.parentNode: w.element)
				continue
			}
			
			// No changes for this slot
			if(!widgetJson.w)
				continue
			
			// Widget moved to this slot
			if(removed[widgetJson.w.id]) {
				var widget = removed[widgetJson.w.id]
				removed[widgetJson.w.id] = null
				delete removed[widgetJson.w.id]
			} else {
				// New widget	
				var widget = this.application.getWidget(widgetJson.w);
				if(!widget)
					continue
			}
				
			widget.update(widgetJson.w)
			
			widget.parent = this
			var el = widget.element
			if(el.parentNode)
			    el.parentNode.removeChild(el)
			if(this.wrap) {
			    var wrap = this.wrap.split(".")
			    var el = document.createElement(wrap[0])
			    if(wrap.length > 1)
			    	el.className = wrap.splice(1, wrap.length-1).join(" ")
			    el.appendChild(widget.element)
			}
			
			if(widgetJson.i < this.element.childNodes.length)
			    this.element.insertBefore(el, this.element.childNodes[widgetJson.i])
			else
			    this.element.appendChild(el)
			    
			if(this.parent) widget.attached()
			else this.lazyAttach.push(widget)
		}
		
		for(var id in removed) {
			if(removed[id])
				this.application.unregister(id)
		}
	}
}

seep.layout.flow.prototype.attached = function() {
	seep.widget.prototype.attached.call(this)
	for(var i=0; i < this.lazyAttach.length; i++) {
		this.lazyAttach[i].attached()
	}
	this.lazyAttach = []
}