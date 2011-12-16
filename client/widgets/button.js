var button = function(json, test) {
	if(!json)
		return
	if(!json.elementType)
		json.elementType = "button"
	
	seep.layout.flow.call(this, json)
	
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
    
    var self = $(this)
    var downHandler = function(event) {
    	self.addClass("down")
    	setTimeout(function() {self.removeClass("down")}, 120)
    }
    
    $(this.element).bind("down", downHandler)
    $(this.element).bind("keypress", function(event) {
    	if(event.keyCode==13) {
    		event.preventDefault()
    		event.stopPropagation()
    	}
    })
    $(this.element).bind("keydown", function(event) {
    	if(event.keyCode==13) {
    		$(this).addClass("down")
    		event.preventDefault()
    		event.stopPropagation()
    	}
    })
    $(this.element).bind("keyup", function(event) {
    	if(event.keyCode==13) {
    		$(this).removeClass("down")
			$(this).trigger("click")
    		event.preventDefault()
    		event.stopPropagation()
    	}
    })
}

button.inherit(seep.layout.flow)
seep.button = seep.field.make(button)

button.prototype.click = function() {
	$(this.element).trigger("down")
	$(this.element).trigger("click")
}
