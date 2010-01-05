//var server = require("./server");
var sys = require("sys");
var http = require("http");
var posix = require("posix");
var Sessions = require('./external/node.js-sessions/Sessions');

// path to app prototype
var pathToApp = {};
// session id to applications
var sessionToApps = {};


var docRoot = __filename.substr(0, __filename.lastIndexOf("/")+1);

var test;


/**
 * Initiate and add a new Seep application
 */
exports.add = function(blueprint, path) {
	var app = null;
	
	if(typeof blueprint == 'function' && typeof blueprint.prototype.getSeepName == 'function') {
		app = blueprint;
	} else {
		for(var o in blueprint) {
			var candidate = blueprint[o];
			if(typeof candidate == 'function' && typeof candidate.prototype.getSeepName == 'function') {
				app = candidate;
				break;
			}
		}
	}
	
	if(app == null) {
		sys.puts("WARNING: Only Seep Application instances can be added. No proper applications candidates found.");
		return;
	}
	
	for(var pth in pathToApp) {
		if(pth == path) {
			sys.puts("-----");
			sys.puts("ERROR: Application already specified for path '" + path + "'");
			return;
		}
	}
	
	/*var appName = app.getSeepName();
	if(typeof appName == 'undefined') {
		sys.puts("WARNING: No name specified for the application. Did you remember to call super in your Application.init()?");
		return;
	}*/
	
	//sys.puts("Adding app '" + app.getSeepName() + "'");
	//app.setPath(path);
	pathToApp[path] = app;
}



// Path to client side scripts
var client_src_path = "/seep_client";
var server = require("./server");

var handleRequest = function(req, res) {
	if(req.uri.path.indexOf(client_src_path) >= 0) {
		// Serving static resources from client package (JS, CSS)
		// TODO add cache headers
		var filename = docRoot+"client"+req.uri.path.substr(req.uri.path.indexOf(client_src_path)+client_src_path.length);
		server.serveFile(req, res, filename);
		return;
	}
	for(var path in pathToApp) {
		if(path == req.uri.path) {
			try {
				var app = getApplication(path, req, res);
				var body = writeAppSerialization(app, html_template);
				respond(res, body, "text/html");
  			} catch(e) {
				default_show_500(req, res, e);
  			}
  			res.finish();
  			return;
  		}
	}
	// Default response (404)
	res.sendHeader(404, {"Content-Type": "text/html"});
  	res.sendBody("<h1>404</h1><p>Not found</p>");
  	res.finish();
}


function getApplication(path, req, res) {
	var session = SessionManager.lookupOrCreate(req, res);
	var app = sessionToApps[session.sid][path];
	if(!app) {
	    app = new pathToApp[path]();
	    app.setDocRoot(docRoot);
	    app.setPath(path);
	    app.setClientPackages(clientPackages);
	    sessionToApps[session.sid][path] = app;
	}
	return app;
}

function writeAppSerialization(app, responseBody) {
	app.repaint();
	return responseBody.replace("@WINDOW_TITLE@", app.getSeepName()).replace(/@CLIENT_PACKAGE@/g, client_src_path).replace("@APP_INIT@", app.serialize());
}





var SessionManager = new Sessions.manager({
    lifetime: 5 * 60 // 5 mins
});

SessionManager.addListener("create", function(sid){
	sessionToApps[sid] = {};
});
    
SessionManager.addListener("change", function(sid, data){
    //sys.puts("<<< "+sid+"\t"+sys.inspect(data));
});

SessionManager.addListener("destroy", function(sid){
	sessionToApps[sid] = null;
	delete sessionToApps[sid];
});




function default_show_500(req, res, e) {
    var msg = ''
    if ('stack' in e && 'type' in e) {
        msg = (
            '<p><strong>' + e.type + '</strong></p><pre>' + 
            e.stack + '</pre>'
        );
    } else {
        msg = JSON.stringify(e, 0, 2);
    }
    respond(res, '<h1>500</h1>' + msg, 'text/html', 500);
}

function respond(res, body, content_type, status) {
    content_type = content_type || 'text/html';
    res.sendHeader(status || 200, {
        'Content-Type': content_type  + '; charset=utf-8'
    });
    res.sendBody(body);
    res.finish();
}





exports.start = function(port) {
	http.createServer(handleRequest).listen(port);
	sys.puts("Seep server running @ 127.0.0.1:"+port);
}









// Export all Seep public classes
exports.Application = require("./application").Application;

exports.ui = {};
exports.ui.Listener = require("./ui/listener").Listener;
exports.ui.Window = require("./ui/window").Window;
exports.ui.Text = require("./ui/text").Text;
exports.ui.Button = require("./ui/button").Button;

exports.ui.layout = require("./ui/layout");


// Pre-load all client side widget sources
var clientPackages = {
	"seep.ui.text":			undefined,
	"seep.ui.button":		undefined,
	"seep.ui.layout.flow":	undefined,
	"seep.ui.window":		undefined
	};
	
for(var pck in clientPackages) {
	if(pck.indexOf("seep")===0) {
		loadWidgetSrc(pck);
	}
}

function loadWidgetSrc(pck) {
	clientPackages[pck] = client_src_path + pck.substr(4).replace(/\./g, "/") + ".js";
	/*var file = docRoot + "client" + pck.substr(4).replace(/\./g, "/") + ".js";
	var promise = posix.cat(file, "utf-8");
	promise.addCallback(function(data) {
		clientSrc[pck] = data;
	});
	promise.addErrback(function() {
	    sys.puts("Error loading " + file);
	});*/
}

exports.clientPackages = clientPackages;









// Load static resources so they're ready when the first request arrives
var html_template = "";
var filename = docRoot + "static/html_template.html";
var encoding = 'text';
var promise = posix.cat(filename, encoding);
promise.addCallback(function(data) {
	html_template = data;
});
promise.addErrback(function() {
	sys.puts("Error loading " + filename);
});