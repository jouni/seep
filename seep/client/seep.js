var seep = {};

seep.init = function(json) {
	var ui = json_parse(json);
	console.log(ui);
}

window.onload = function() {
	seep.init(window.seepinit);
}