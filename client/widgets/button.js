seep.button = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = "button"
	
	seep.field.call(this, json)
	
	$(this.element).bind("mousedown", function(event) {
    	event.preventDefault()
    })
}

seep.button.inherit(seep.field)