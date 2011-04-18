seep.input = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = "input"
	
	seep.field.call(this, json)
	this.element.type = "text"
	
	var self = this
	$(this.element).change(function(e) {
		self.application.sync(self.id, "text", this.value)
	})
}

seep.input.inherit(seep.field)