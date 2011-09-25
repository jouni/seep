// Register for Seep app prototypes that are bound to different 
// paths/contexts


/***********************************************************************
 * External dependencies
 ***********************************************************************/
var path = require("path");

/***********************************************************************
 * Map holding references from path (URL) to Application prototype
 *  E.g. 
 * 		"app-uri" 		-> 		Application prototype
 ***********************************************************************/
var pathToApp = {};


/***********************************************************************
 * Register new application prototype
 ***********************************************************************/
exports.registerApp = function(filename) {
	// Sanity check. Don't allow app files to reside inside the Seep 
	// module folder, with the exception of the test & demo package folders
	var targetFolder = path.normalize(path.dirname(filename))
	var seepFolder = path.normalize(path.dirname(__filename) + "/..")
	var seepTestFolder = path.normalize(seepFolder+"/test")
	var seepDemoFolder = path.normalize(seepFolder+"/demo")
	if(targetFolder.indexOf(seepTestFolder) === -1 
				&& targetFolder.indexOf(seepDemoFolder) ===-1 
				&& targetFolder.indexOf(seepFolder) === 0) {
		console.error("ERROR: Can't deploy files from inside Seep module"
						+ " folder (" + path.normalize(filename) + ")")
		return false
	}
	
	var app = null
	var blueprint = require(filename)
	if(typeof blueprint == 'function' 
			&& typeof blueprint.prototype.__seepApp != 'undefined') {
	    app = blueprint
	} else {
	    for(var o in blueprint) {
	    	var candidate = blueprint[o]
	    	if(typeof candidate == 'function' 
	    			&& typeof candidate.prototype.__seepApp != 'undefined') {
	    		app = candidate
	    		break
	    	}
	    }
	}
	
	if(app == null) {
	    console.warn("WARNING: Only Seep Application instances can be added."
	    				+ " No proper applications candidates found (tried to"
	    				+ " deploy file '" + filename + "')")
	    return false
	}
	var appPath = path.basename(filename, ".js")
	pathToApp[appPath] = app
	console.info("INFO: Added new Seep application prototype to path '"
					+ appPath + "'")
}


/***********************************************************************
 * Get an application prototype for a given path
 * Returns null if no prototype is found for the path
 ***********************************************************************/
exports.getAppForPath = function(path) {
	if(pathToApp[path]) {
		return pathToApp[path]
	}
	console.warn("WARNING: No application prototype found for path " + path);
	return null;
}