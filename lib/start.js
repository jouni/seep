#!/usr/bin/env node

var fs = require("fs")
  , path = require("path")
  , seep = require("../index")
  , program = require("commander")
  , log4js = require("log4js")
  , logger = log4js.getLogger("Seep")
  
var DEPLOY_INTERVAL = 10000
  , DEFAULT_PORT = 8000
  , DEFAULT_LOG_LEVEL = "INFO"
  
  

var watched = []
  , exclude = []

// Get the version information from the package.json
var packageJSON = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf-8'))
program
    .version(packageJSON.version)
    .option('-p, --port <number>', 'use a custom http port (default is 8000)')
    .option('-l, --log <level>', 'set the logging level (TRACE, DEBUG, INFO, WARN, ERROR)')

/* Maybe later (initialize a dummy Seep project)
program
    .command('init [directory]')
    .description('Initialize a new project and listen for connections.')
    .action(function(dir){checkForDependencies(function(){
        project.chdir(dir)
        project.init()
        project.start()
        server.listen(program.port || process.env.PORT || 8123)
    })})
*/

program
    .command('start <file>')
    .description('Deploy the application described by the specified file. If it is a directory, all suitable applications inside that directory are deployed.')
    .action(function(file){
    
    	program.port = program.port || DEFAULT_PORT
    	logger.setLevel(program.log || DEFAULT_LOG_LEVEL)
		
		// Is this a relative path?
		if(file.indexOf("/") !== 0) {
			file = process.cwd() + "/" + file
		}
		file = path.normalize(file)
		
		// Does it exist?
		if(!path.existsSync(file)) {
			logger.error("The specified target '"+file+"' doesn't exist.")
			return
		}
		
		// Is this a file or a folder? Only accept .js as the file ending
		if(path.extname(file) == ".js") {
			if(!seep.registerApp(file)) {
				logger.error("The file doesn't export any Seep application prototype.")
			}
			var folder = path.dirname(file)
		} else {
			watch_dir(file)
			var folder = file
		}
		
		// Start the server
		seep.start(program.port, folder)
		console.log("Seep server running at http://localhost:"+program.port)
		
		// Give additional info of the available apps
		var apps = "The following applications are available:\n"
		seep.availableApps().forEach(function(uri) {
			apps += "\thttp://localhost:"+program.port+"/"+uri+"\n"
		})
		logger.info(apps)
    })


// Parse the commands
program.parse(process.argv);


function watch_dir(dir) {
	var files = fs.readdirSync(dir)
	for(var i=0; i < files.length; i++) {
	    if(path.extname(files[i]) == ".js") {
	    	var file = path.basename(files[i])
	    	if(watched.indexOf(file) == -1 && exclude.indexOf(file) == -1) {
	    		var added = seep.registerApp(dir + "/" + file)
	    		if(added) {
	    			watched.push(file)
	    		} else {
	    			exclude.push(file)
	    		}
	    	}
	    }
	}
}

/* TODO maybe later (allow runtime addition of apps and update already deployed apps)
fs.watchFile(deploy_dir, {persistent: true, interval: DEPLOY_INTERVAL}, function(curr, prev) {
	if(curr.mtime.getTime() != prev.mtime.getTime())
		watch_dir(deploy_dir);
});
*/