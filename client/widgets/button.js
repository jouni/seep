seep.button = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = "button"
	
	seep.field.call(this, json)
}

seep.button.inherit(seep.field)