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
				var el = this.wrap? w.element.parentNode: w.element
				if(widgetJson.anim) {
					$(el).animate({"opacity": 0, duration: 130, after: function() {
						el.parentNode.removeChild(el)
					}})
				} else
					this.element.removeChild(el)
				continue
			}
			
			var widget = this.application.getWidgetById(widgetJson.w.id)
			
			if(widget && !removed[widget.id]) {
				// 'k' is the element index in this layout
				var k=0, e = this.wrap? widget.element.parentNode : widget.element
				while (e = e.previousSibling) { ++k;}
				if(k == widgetJson.i) {
					// Widget is already in the same location
					widget.update(widgetJson.w)
					continue
				}
			} else if(removed[widgetJson.w.id]) {
				// Widget was moved to this slot
				var widget = removed[widgetJson.w.id]
				removed[widgetJson.w.id] = null
				delete removed[widgetJson.w.id]
			} else {
				// Totally new widget for this layout
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
			
			// Animate
			if(widgetJson.anim) {
				var h = $(el).css("height")
				$(el).css({"margin-top": "-"+h, "opacity": 0})
				$(el).animate({"margin-top": 0, duration: 200})
				$(el).animate({"opacity": 1, duration: 500})
			}
			
			    
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