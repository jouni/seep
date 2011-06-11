seep.field = function(json) {
	if(!json)
		return
	
	seep.text.call(this, json)
	
	var self = this
	this.watch("disabled", function(prop, old, val) {
		if(self.type == "checkbox")
			self.checkbox.disabled = val
		self.element.disabled = val
		if(val) $(self.element).addClass("s-disabled")
		else $(self.element).removeClass("s-disabled")
		self.sync(prop, old, val)
		return val
	})
	
	this.watch("readOnly", function(prop, old, val) {
		if(self.type == "checkbox")
			self.checkbox.disabled = val
		self.element.readOnly = val
		self.sync(prop, old, val)
		return val
	})
	
	this.watch("tabIndex", function(prop, old, val) {
		if(self.type == "checkbox")
			self.checkbox.tabIndex = val
		self.element.tabIndex = val
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
	if(typeof json.readOnly != "undefined") {
		this.readOnly = json.readOnly
	}
	if(typeof json.tabIndex != "undefined") {
		this.tabIndex = json.tabIndex
	}
	this.sync(true)
}

seep.field.prototype.focus = function(json) {
	this.element.focus()
}