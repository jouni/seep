// Extend built-in function object
Function.prototype.runInClient = function() {
	var s = this.toString().replace(/[\n\t]/g,"");
	s = s.substring(s.indexOf("{")+1, s.lastIndexOf("}"));
	return s;
}