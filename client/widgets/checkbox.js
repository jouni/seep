seep.checkbox = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = "label"
	
	seep.field.call(this, json)
	
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
		return val
	})
	
	$(this.checkbox).change(function() {
		self.sync("checked", !this.checked, this.checked)
		self.sync(false)
		self.checked = this.checked
		self.sync(true)
	})
	
	$(this.element).bind("mousedown", function(event) {
    	event.preventDefault()
    })
}

seep.checkbox.inherit(seep.field)

seep.checkbox.prototype.update = function(json) {
	seep.field.prototype.update.call(this, json);
	this.sync(false)
	if(typeof json.checked != "undefined") {
		this.checked = json.checked
	}
	this.sync(true)
}

seep.checkbox.prototype.focus = function(json) {
	this.checkbox.focus()
}