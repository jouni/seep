seep.button = function(json) {
	if(!json)
		return
	
	if(!json.elementType)
		json.elementType = "button"
	
	seep.field.call(this, json)
	
	$(this.element).bind("mousedown", function(event) {
		if(event.which == 1) {
			$(this).addClass("down")
			this._clicking = true
    		event.preventDefault()
    		event.stopPropagation()
    	}
    })
    
    $(this.element).bind("mouseup", function(event) {
    	if(event.which == 1) {
			$(this).removeClass("down")
			this._clicking = false
		}
    })
	
    $(this.element).bind("mouseout", function(event) {
		$(this).removeClass("down")
    })
    
    var downHandler = function(event) {
    	var self = $(this)
    	self.addClass("down");
    	setTimeout(function() {self.removeClass("down")}, 120)
    }
    
    $(this.element).bind("down", downHandler)
    $(this.element).bind("keypress", function(event) {
    	if(event.keyCode==13)
    		downHandler.call(this, event)
    })
}

seep.button.inherit(seep.field)

seep.button.prototype.click = function() {
	$(this.element).trigger("down")
	$(this.element).trigger("click")
}