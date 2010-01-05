var Widget = require("../widget").Widget;

var Flow = Widget.extend({

	type: "seep.ui.layout.flow",
	
	init: function() {
		this._super();
		this.widgets = new Array();
	},
	
	add: function(widget) {
		this.widgets.push(widget);
		widget.setParent(this);
		if(this.application) {
			widget.setApplication(this.application);
		}
	},
	
	setApplication: function(app) {
		this._super(app);
		for(var i=0; i < this.widgets.length;i++) {
			this.widgets[i].setApplication(app);
		}
	},
	
	serialize: function(out) {
		this._super(out);
		var c = [];
		for(var i=0; i < this.widgets.length;i++) {
			c.push(this.widgets[i].serialize({}));
		}
		out.widgets = c;
		return out;
	}

});

exports.Flow = Flow;