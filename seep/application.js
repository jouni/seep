var c = require("./external/class");
var sys = require("sys");

var Application = c.Class.extend({

  path: undefined,

  init: function(name){
  	this.name = name;
  },
  
  getName: function(){
    return this.name;
  },
  
  getPath: function(){
    return this.path;
  },
  
  setPath: function(path){
    this.path = path;
  }
  
});

process.mixin(true, exports, Application);

sys.puts(typeof exports);