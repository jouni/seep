seep.field = function(json) {
	if(!json)
		return
	
	seep.text.call(this, json)
	
	var self = this
	this.watch("disabled", function(prop, old, val) {
		if(self.type == "checkbox")
			self.checkbox.disabled = val
		self.element.disabled = val
		self.sync(prop, old, val)
		return val
	})
	
}

seep.field.inherit(seep.text)

seep.field.prototype.update = function(json) {
	seep.text.prototype.update.call(this, json)
	this.sync(false)
	if(typeof json.disabled != "undefined") {
		this.disabled = json.disabled
	}
	this.sync(true)
}