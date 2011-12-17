var input = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = json.multiline? "textarea" : "input"
	
	seep.text.call(this, json)
	
	if(!json.multiline)
		this.element.type = "text"
	
	var self = this
	$(this.element).change(function(e) {
		if(self.__cancelEvent)
			return true
		self._preventDomUpdate = true
		self.text = this.value
		self._preventDomUpdate = false
		e.stopPropagation()
		e.preventDefault()
	})
	
	function keyHandler(e) {
		if(self.text != this.value) {
			self._preventDomUpdate = true
			self.text = this.value
			self._preventDomUpdate = false
		}
	}
	
	$(this.element).keyup(keyHandler)
	$(this.element).keydown(keyHandler)
}

input.inherit(seep.text)

input.prototype.update = function(json) {
	seep.text.prototype.update.call(this, json)
	if(json.placeholder)
		this.element.placeholder = json.placeholder
}

seep.input = seep.field.make(input)

// Override so we can select the text
seep.input.prototype.focus = function() {
	this.element.focus()
	this.element.select()
}