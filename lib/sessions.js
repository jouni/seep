/***********************************************************************
 * Internal dependencies
 ***********************************************************************/
// Handles available applications on this server
var appRegistry = require("./app-registry")
  , log4js = require("log4js")
  , logger = log4js.getLogger("Seep")

exports.appRegistry = appRegistry


var sessions = {}

exports.getApp = function(appPath, sid) {

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
	    logger.debug("Starting a new app for path '" + appPath + "'")
	    var newApp = new (appRegistry.getAppForPath(appPath))()
	    newApp.setPath(appPath)
	    newApp.start()
	    sessions[sid][appPath] = newApp
	}
	
	return sessions[sid][appPath]

}