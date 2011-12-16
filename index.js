// Seep universal class, used by both application developers and Seep itself


/***********************************************************************
 * Export all Seep public classes
 ***********************************************************************/
exports.Application = require("./lib/application").Application
exports.Text = require("./lib/widgets/text").Text
exports.Input = require("./lib/widgets/input").Input
exports.Button = require("./lib/widgets/button").Button
exports.Checkbox = require("./lib/widgets/checkbox").Checkbox
exports.Overlay = require("./lib/widgets/overlay").Overlay
exports.layout = require("./lib/widgets/layout") // All layout widgets




/***********************************************************************
 * External dependencies
 ***********************************************************************/
var connect = require("connect")
  , socket_io = require("socket.io")
  , path = require("path")
  , fs = require("fs")
  , log4js = require("log4js")
  , logger = log4js.getLogger("Seep")




/***********************************************************************
 * Internal dependencies
 ***********************************************************************/
// Handles client sessions application instances
var sessions = require("./lib/sessions")
  , settings = require("./client/seep.js")



/***********************************************************************
 * Public API
 ***********************************************************************/
/**
 * Add a new Seep application to the server catalog of available apps
 * return true on success, false on fail
 */
exports.registerApp = function(filename) {
	return sessions.appRegistry.registerApp(filename)
}
exports.availableApps = function() {
	return sessions.appRegistry.availableApps()
}


/**
 * Start the Seep server
 * @param port number the port in which to run the HTTP server for Seep
 * @param folder string the folder from which to search for Seep application classes (the folder is scanned for .js files which export a Seep application prototype)
 *
 * returns null
 */
exports.start = function(port, folder) {

	

	// Don't let the browser to cache these files
	// TODO different settings for production
	connect.session.ignore.push('/', '/seep.js', '/socket.io/socket.io.js', '/widgets', '/ender.min.js', 'LAB.js');
	
	// Create the server
	var server = connect.createServer(
  		    connect.cookieParser()
  		    // FIXME specify session timeout and do proper cleanup when session ends
	  	  , connect.session({ secret: "TODO-generate-key" })
	  	  , connect.favicon()
	  	  , connect.static(__dirname + "/client")
	  	  , connect.static(folder + "/public")
	  	  
	  	  // Custom handling for direct application URL's
		  , connect.router(function(app){
				app.get('/*', function(req, res, next){
					var path = req.url.substr(1)
					if(sessions.appRegistry.availableApps().indexOf(path) > -1) {
						fs.readFile(__dirname + "/client/default.html", "utf-8", function(err, file) {
							if(err) {
								logger.error(err)
								next()
								return
							}
							// TODO if not in root context, set the server_addr
							res.end(file.replace("APP_URL", path).replace("SERVER_ADDR", "/"))
						})
					} else {
						next()
					}
				})
			})
	  )
	
	
	// Start listening requests
	server.listen(port)
	
	// Derive Socket.io log level from the log4js level
	var logLevel = Math.ceil(4 - (logger.level.level/10000))
	var io = socket_io.listen(server, {"log level": logLevel})
	
	io.sockets.on("connection", function (socket) {
		socket.on(settings.MESSAGE_INIT, function(data, callback) {
			if(!data.sid) {
		        data.sid = socket.id
		        socket.emit("update", {sid: socket.id})
		    }
		    var app = sessions.getApp(data.path, data.sid)
		    if(app) {
		    	// Only initiate the connection once
		    	if(!app.connection) {
		    		io.of("/" + data.path + "_" + data.sid).on("connection", function(socket) {
		    			app.setConnection(socket)
			    	})
			    }
		    	callback(data.sid)
	    	}
	    	else
	    		logger.error("No application found for client/path", data.sid, data.path)
		})
	})
	
	/* ONLY FOR PRODUCTION */
	/*
	io.enable('browser client minification')  // send minified client
	io.enable('browser client etag')          // apply etag caching logic based on version number
	io.set('log level', 1)                    // reduce logging
	io.set('transports', [                    // enable all transports (optional if you want flashsocket)
	    'websocket'
	  , 'flashsocket'
	  , 'htmlfile'
	  , 'xhr-polling'
	  , 'jsonp-polling'
	])
	*/
}