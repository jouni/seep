seep.overlay = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = "div"
	
	seep.layout.flow.call(this, json)
	
	this.element.style.top = 0
	this.element.style.left = 0
	
	var self = this
	this.watch("top", function(prop, old, val) {
		this.element.style.top = val
		self.sync(prop, old, val)
		return val
	})
	this.watch("left", function(prop, old, val) {
		this.element.style.left = val
		self.sync(prop, old, val)
		return val
	})
	
}

seep.overlay.inherit(seep.layout.flow)
	
seep.overlay.prototype.update = function(json) {
	seep.layout.flow.prototype.update.call(this, json)
	this.sync(false)
	if(json.center) {
		this.__centerLeft = true
		this.__centerTop = true
	}
	if(json.top) {
		this.top = json.top
		delete this.__centerTop
	}
	if(json.left) {
		this.left = json.left
		delete this.__centerLeft
	}
	this.sync(true)
}

seep.overlay.prototype.attached = function() {
	// TODO take into account the app elements position on the page
	seep.layout.flow.prototype.attached.call(this)
	if(this.__centerLeft || this.__centerTop) {
		var appOffset = $(this.application.getElement()).offset()
		var offset = $(this.element).offset()
		if(this.__centerLeft) {
			this.element.style.left = (appOffset.width - offset.width) / 2 + "px"
			delete this.__centerLeft
		}
		if(this.__centerTop) {
			this.element.style.top = (appOffset.height - offset.height) / 2 + "px"
			delete this.__centerTop
		}
	}
	if(this.visible) {
		$(this.element).css({"opacity": 0})
		$(this.element).animate({"opacity": 1, duration: 400})
	}
}