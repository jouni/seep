var Widget = require("../widget").Widget;

exports.Flow = Widget.extend({
	
	// Should child widgets be wrapper with additional elements (this should be a string for the element type)
	wrap: undefined,
	
	init: function(opts) {
		this._super(__filename)
		this.widgets = []
		var opts = opts || {}
		this.wrap = opts.wrap? opts.wrap : false;
		if(this.wrap)
			this.outBuffer.wrap = this.wrap
	},
	
	add: function(widget) {
		if(widget == null)
			return
		if(this.widgets.indexOf(widget)===-1 && widget.getParent()==null) {
			this.widgets.push(widget);
			
			widget.setParent(this);
			if(this.application) {
				widget.setApplication(this.application);
			}
			
			if(!this.outBuffer.widgets)
				this.outBuffer.widgets = []
			this.outBuffer.widgets[this.widgets.indexOf(widget)] = widget
			
			this.repaint()
		}
	},
	
	remove: function(widget) {
		if(typeof widget == "number") {
			var index = widget
			var widget = this.widgets[index]
		} else {
			var index = this.widgets.indexOf(widget)
		}
		
		if(!widget || index===-1)
			return
		
		if(!this.outBuffer.widgets)
			this.outBuffer.widgets = []
		this.outBuffer.widgets[index] = {id: widget.id, removed: true}
		
		this.widgets[index] = null
		if(this.application)
			this.application.unregisterWidget(widget)
		
		this.repaint()
	},
	
	count: function() {
		var count = 0
		for(var i=0; i < this.widgets.length; i++)
			if(this.widgets[i])
				count++
		return count
	},
	
	setApplication: function(app) {
		this._super(app);
		for(var i=0; i < this.widgets.length;i++) {
			this.widgets[i].setApplication(app);
		}
	},
	
	repaint: function(recurse) {
		this._super(recurse);
		
		if(recurse)
			if(this.wrap)
				this.outBuffer.wrap = this.wrap
			
		for(var i=0; i < this.widgets.length; i++) {
			var w = this.widgets[i]
			if(!w)
				continue // Removed widget, will be cleaned after next serialize
			
			if(recurse)
				w.repaint(recurse)
			
			if(w.needsRepaint()) {
				if(!this.outBuffer.widgets)
					this.outBuffer.widgets = []
				this.outBuffer.widgets[this.widgets.indexOf(w)] = w
			}
		}
	},
	
	serialize: function() {
		if(this.outBuffer.widgets) {
			for(var i=0; i < this.outBuffer.widgets.length; i++) {
				var w = this.outBuffer.widgets[i]
				if(w && !w.removed)
					this.outBuffer.widgets[i] = w.serialize()
			}
		}
		// Cleanup removed widgets
		for(var i=0; i < this.widgets.length; i++) {
			if(this.widgets[i] == null)
				this.widgets.splice(i, 1)
		}
		return this._super()
	}

});
