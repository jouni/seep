var fs = require("fs")
  , path = require("path")
  , seep = require("../index")

var DEPLOY_INTERVAL = 10000

var PORT = process.argv[3]? process.argv[3].trim() : 8000


// Path given from command line. Monitor this folder for changes and deploy all .js files
var deploy_dir = process.argv[2].trim()

// Always include a backslash as the last character in the path
if(deploy_dir.lastIndexOf("/") != deploy_dir.length-1) {
	deploy_dir += "/"
}

deploy_dir = path.normalize(deploy_dir);
console.log("Seep is watching the deploy directory '" + deploy_dir + "'")


var watched = [];
var exclude = [];


function watch_dir(dir) {
	fs.readdir(dir, function(err, files) {
		if(err) {
			console.log(err);
			return;
		}
		for(var i=0; i<files.length; i++) {
			if(files[i].substr(files[i].length-3, files[i].length) == ".js") {
				var file = path.basename(files[i]);
				if(watched.indexOf(file) == -1 && exclude.indexOf(file) == -1) {
					var added = seep.registerApp(deploy_dir + file);
					if(added) {
						watched.push(file);
					} else {
						exclude.push(file);
					}
				}
			}
		}
	});
}

watch_dir(deploy_dir);

fs.watchFile(deploy_dir, {persistent: true, interval: DEPLOY_INTERVAL}, function(curr, prev) {
	if(curr.mtime.getTime() != prev.mtime.getTime())
		watch_dir(deploy_dir);
});

seep.start(PORT, deploy_dir);
