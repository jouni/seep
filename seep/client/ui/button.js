function seep_ui_button() {
	console.log("seep.ui.button initialized");
}
seep_ui_button.prototype.update = function(json) {
	this.id = json.id;
	this.caption = json.caption;
}
seep.widgetLoaded();