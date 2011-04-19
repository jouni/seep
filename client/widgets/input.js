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
		self.sync(false)
		self.text = this.value
		self.sync(true)
		self.application.sync(self.id, "text", this.value)
	})
}

seep.input.inherit(seep.field)