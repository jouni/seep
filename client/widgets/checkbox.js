seep.checkbox = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = "label"
	
	seep.text.call(this, json)
	
	this.checkbox = document.createElement("input")
	this.checkbox.type = "checkbox"
	
	this.label = document.createElement("span")
	
	this.element.appendChild(this.checkbox)
	this.element.appendChild(this.label)
	
	var self = this
	this.watch("checked", function(prop, old, val) {
		self.checkbox.checked = val
		$(self.element).toggleClass("s-checked", val)
		self.sync(prop, old, val)
		if(this.synching)
			$(self.element).trigger("change")
		return val
	})
	
	$(this.checkbox).change(function(e) {
		self.checked = this.checked
		e.stopPropagation()
		e.preventDefault()
	})
	
	$(this.element).bind("mousedown", function(event) {
    	event.preventDefault()
    	event.stopPropagation()
    })
}

seep.checkbox.inherit(seep.text)

seep.checkbox.prototype.update = function(json) {
	seep.text.prototype.update.call(this, json);
	this.sync(false)
	if(typeof json.checked != "undefined") {
		this.checked = json.checked
	}
	this.sync(true)
}

seep.checkbox.prototype.focus = function(json) {
	this.checkbox.focus()
}

seep.checkbox = seep.field.make(seep.checkbox)