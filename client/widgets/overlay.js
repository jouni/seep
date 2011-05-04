seep.overlay = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = "div"
	
	seep.layout.flow.call(this, json)
	
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
	if(json.top)
		this.top = json.top
	if(json.left)
		this.left = json.left
	this.sync(true)
}