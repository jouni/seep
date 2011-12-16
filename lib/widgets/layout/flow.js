var Widget = require("../widget").Widget

exports.Flow = Widget.extend({
	
	init: function(opts) {
		this._super(__filename)
		this.widgets = []
		var opts = opts || {}
		this.wrap = opts.wrap? opts.wrap : false
		if(this.wrap)
			this.outBuffer.wrap = this.wrap
		this.addStyle("s-flow")
	},
	
	add: function(widget, props) {
		var props = props || {}
		var index = (typeof props.index=="undefined")? this.widgets.length : props.index
		if(widget == null || (widget.parent && widget.parent == this))
			return
		
		if(typeof widget == "object" && widget.length) {
			for(var i=0; i < widget.length; i++)
				this.add(widget[i])
			return
		}
		
		if(this.widgets.indexOf(widget)===-1 && widget.getParent()==null) {
			this.widgets.splice(index, 0, widget)
			
			widget.setParent(this)
			if(this.application) {
				widget.setApplication(this.application)
			}
			
			if(!this.outBuffer.widgets)
				this.outBuffer.widgets = []
			
			var out = {i: index, w: widget, dirty: true}
			if(props.animate)
				out.anim = true
				
			this.outBuffer.widgets.push(out)
			
			widget.repaint()
			this.repaint()
		}
	},
	
	remove: function(widget, props) {
		var props = props || {}
		
		if(typeof widget == "number") {
			var index = widget
			if(index > this.widgets.length-1)
				return null
			var widget = this.widgets[index]
		} else {
			var index = this.widgets.indexOf(widget)
		}
		
		if(!widget || index===-1)
			return null
		
		if(!this.outBuffer.widgets)
			this.outBuffer.widgets = []
		
		var out = {i: index, id: widget.id, remove: true}
		if(props.animate)
			out.anim = true
		
		this.outBuffer.widgets.push(out)
		
		this.widgets.splice(index, 1)
		
		if(this.application)
			this.application.unregisterWidget(widget)
		
		this.repaint()
		
		return widget
	},
	
	count: function() {
		return this.widgets.length
	},
	
	getWidgetIndex: function(widget) {
		return this.widgets.indexOf(widget)
	},
	
	getWidget: function(index) {
		if(index >= this.widgets.length)
			return null
		return this.widgets[index]
	},
	
	setApplication: function(app) {
		this._super(app);
		for(var i=0; i < this.widgets.length;i++) {
			this.widgets[i].setApplication(app);
		}
	},
	
	repaint: function(recurse) {
		if(recurse) {
			if(this.wrap)
				this.outBuffer.wrap = this.wrap
			
			this.outBuffer.widgets = []
			for(var i=0; i < this.widgets.length; i++) {
				var widget = this.widgets[i]
				widget.repaint(recurse)
				this.outBuffer.widgets.push({i: i, w: widget, dirty: true})
			}
		} else {
			/*for(var i=0; i < this.widgets.length; i++) {
				var widget = this.widgets[i]
				if(widget.needsRepaint()) {
					if(!this.outBuffer.widgets)
						this.outBuffer.widgets = []
					this.outBuffer.widgets.push({i: i, w: widget, dirty: true} )
				}
			}*/
		}
		this._super(recurse)
	},
	
	serialize: function() {
		var processedWidgets = []
		if(this.outBuffer.widgets) {
			for(var i=0; i < this.outBuffer.widgets.length; i++) {
				var widget = this.outBuffer.widgets[i].w
				var index = this.outBuffer.widgets[i].i
				var remove = this.outBuffer.widgets[i].remove
				var anim = this.outBuffer.widgets[i].anim
				var dirty = this.outBuffer.widgets[i].dirty
				if(widget && !remove && dirty) {
					this.outBuffer.widgets[i] = null
					widget = widget.serialize()
					this.outBuffer.widgets[i] = {i: index, w: widget}
					if(anim)
						this.outBuffer.widgets[i].anim = true
					processedWidgets.push(widget.id)
				} else if(widget)
					processedWidgets.push(widget)
			}
		}
		for(var i=0; i < this.widgets.length; i++) {
				var widget = this.widgets[i]
				if(widget.needsRepaint() && processedWidgets.indexOf(widget.id) === -1) {
					widget = widget.serialize()
					if(!this.outBuffer.widgets)
						this.outBuffer.widgets = []
					this.outBuffer.widgets.push({i: i, w: widget})
				}
			}
		return this._super()
	}

});
