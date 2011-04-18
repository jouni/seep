// Seep universal class, used by both application developers and Seep itself


/***********************************************************************
 * Export all Seep public classes
 ***********************************************************************/
exports.Application = require("./lib/application").Application
exports.Text = require("./lib/widgets/text").Text
exports.Input = require("./lib/widgets/input").Input
exports.Button = require("./lib/widgets/button").Button
exports.Checkbox = require("./lib/widgets/checkbox").Checkbox
exports.layout = require("./lib/widgets/layout") // All layout widgets




/***********************************************************************
 * External dependencies
 ***********************************************************************/
var connect = require("connect")
  , io = require("socket.io")
  , socketIO = require("socket.io-connect").socketIO
  , MemoryStore = require('connect/lib/middleware/session/memory')
  , path = require("path")




/***********************************************************************
 * Internal dependencies
 ***********************************************************************/
// Handles client sessions application instances
var sessions = require("./lib/sessions")



/***********************************************************************
 * Public API
 ***********************************************************************/
/**
 * Add a new Seep application to the server catalog of available apps
 * return true on success, false on fail
 */
exports.registerApp = function(filename) {
	return sessions.appRegistry.registerApp(filename);
}


/**
 * Start the Seep server
 */
exports.start = function(port, folder) {
  connect.session.ignore.push('/', '/seep.js', '/LAB.js', '/socket.io/socket.io.js', '/widgets', '/jquery-1.4.2.min.js');
  var server = connect.createServer(
  		    connect.cookieParser()
  		    // FIXME specify session timeout and do proper cleanup when session ends
	  	  , connect.session({ secret: "TODO-generate-key" })
	  	  , connect.favicon()
	  	  , connect.static(__dirname + "/client")
	  	  , connect.static(folder + "public")
	  )
	
	server.listen(port)
	console.info("Seep server running at port " + port)
	
	var socket = io.listen(server)
	
	socket.on("connection", socket.prefixWithMiddleware(function (client, req, res) {
		sessions.handleSocket(client, req, res)
	}))
}