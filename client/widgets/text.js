seep.text = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = "span"
	
	seep.widget.call(this, json)
	
	var self = this
	this.watch("text", function(prop, old, val) {
		if(this.type == "input" && !this._preventDomUpdate)
			this.element.value = "" + val
		else if(this.type=="checkbox")
			this.label.innerHTML = val
		else if(this.type != "input")
			this.element.innerHTML = val
		
		self.sync(prop, old, val)
		return val
	})
	
}

seep.text.inherit(seep.widget)
	
seep.text.prototype.update = function(json) {
	seep.widget.prototype.update.call(this, json)
	this.sync(false)
	if(typeof json.text != "undefined")
		this.text = json.text
	this.sync(true)
}