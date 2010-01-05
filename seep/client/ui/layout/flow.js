function seep_ui_layout_flow() {
	console.log("flow initialized");
}
seep_ui_layout_flow.prototype.update = function(json) {
	this.id = json.id;
	for(var i=0; i < json.widgets.length; i++) {
		var widgetJson = json.widgets[i];
		var widget = seep.getWidget(widgetJson);
		widget.update(widgetJson);
		console.log(widget);
	}
}


seep.widgetLoaded();
