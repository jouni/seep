function seep_ui_text() {
	console.log("seep.ui.text initialized");
}
seep_ui_text.prototype.update = function(json) {
	this.id = json.id;
	this.text = json.text;
}
seep.widgetLoaded();