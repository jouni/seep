/***********************************************************************
 * Internal dependencies
 ***********************************************************************/
// Handles available applications on this server
var appRegistry = require("./app-registry")
  , settings = require("../client/seep.js")

exports.appRegistry = appRegistry


var sessions = {}

var getApp = function(appPath, sid) {

	// Check that we have the requested application prototype
	if(appRegistry.getAppForPath(appPath) == undefined) {
		return null
	}
	
	// Create a namespace for this session of not already found
	if(!sessions[sid])
		sessions[sid] = {}
	
	// Check if we already have an instance running for this 
	// session and path. If not, create new from the prototype
	if(typeof sessions[sid][appPath] == "undefined") {
	    console.log("\nCreating a new app for path '" + appPath + "'")
	    var newApp = new (appRegistry.getAppForPath(appPath))()
	    newApp.setPath(appPath)
	    newApp.start()
	    sessions[sid][appPath] = newApp
	}
	
	return sessions[sid][appPath]

}



// Called when a client connects
exports.handleSocket = function (socket) {
	socket.on(settings.MESSAGE_INIT, function(data) {
		if(!data.sid) {
	        data.sid = socket.id
	        socket.emit("update", {sid: socket.id})
	    }
	    var app = getApp(data.path, data.sid)
	    if(app)
    	    app.setConnection(socket)
    	else
    		console.error("No application found for client/path", data.sid, data.path)
	})
	/*
	client.on("disconnect", function() {
		// TODO close the application? Must be parametrisable on application basis
	})*/
}