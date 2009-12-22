$LAB
.script("../.json_parse.js").wait(function() {
	var seep = {};
	
	seep.init = function(json) {
		var ui = json_parse(json);
		console.log(ui);
	}
	
	window.onload = function() {
		seep.init(window.seepinit);
	}
});

