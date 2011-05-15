seep.input = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = json.multiline? "textarea" : "input"
	
	seep.field.call(this, json)
	
	if(!json.multiline)
		this.element.type = "text"
	
	var self = this
	$(this.element).change(function(e) {
		self._preventDomUpdate = true
		self.text = this.value
		self._preventDomUpdate = false
	})
	
	$(this.element).keydown(function(e) {
		if(self.text != this.value) {
			self._preventDomUpdate = true
			self.text = this.value
			self._preventDomUpdate = false
		}
	})
}

seep.input.inherit(seep.field)

seep.input.prototype.update = function(json) {
	seep.field.prototype.update.call(this, json)
	if(json.placeholder)
		this.element.placeholder = json.placeholder
}

seep.input.prototype.focus = function(json) {
	seep.field.prototype.focus.call(this, json)
	this.element.select()
}