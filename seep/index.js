//var server = require("./server");
var sys = require("sys");
var http = require("http");
var posix = require("posix");

var apps = [];


/**
 * Initiate and add a new Seep application
 */
exports.add = function(blueprint, uri) {
	var app = null;
	
	if(typeof blueprint == 'function' && typeof blueprint.prototype.getSeepName == 'function') {
		app = new blueprint;
	} else {
		for(var o in blueprint) {
			var candidate = blueprint[o];
			if(typeof candidate == 'function' && typeof candidate.prototype.getSeepName == 'function') {
				app = new candidate;
				break;
			}
		}
	}
	
	if(app == null) {
		sys.puts("WARNING: Only Seep Application instances can be added. No proper applications candidates found.");
		return;
	}
	
	//if(typeof apps[uri] != "undefined") {
	//	sys.puts("Application already specified for URI " + uri);
	//	return;
	//}
	
	var appName = app.getSeepName();
	if(typeof appName == 'undefined') {
		sys.puts("WARNING: No name specified for the application. Did you remember to call super in your Application.init()?");
		return;
	}
	
	sys.puts("Adding app '" + app.getSeepName() + "'");
	app.setPath(uri);
	apps.push(app);
	return app;
}


var handleRequest = function(req, res) {
	for(var i=0; i < apps.length; i++) {
		var app = apps[i];
		if(app.getPath() == req.uri.path) {
			try {
				var body = html_template;
				body = body.replace("@WINDOW_TITLE@", app.getMainWindow().getTitle()).replace("@WINDOW_CONTENT@", app.toString());
				respond(res, body, "text/html");
  			} catch(e) {
				default_show_500(req, res, e);
  			}
  			res.finish();
  		}
	}
	// Default response (404)
	res.sendHeader(404, {"Content-Type": "text/html"});
  	res.sendBody("<h1>404</h1><p>Not found</p>");
  	res.finish();
}

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










exports.Application = require("./application").Application;

exports.ui = {};
exports.ui.Window = require("./ui/window").Window;
exports.ui.Text = require("./ui/text").Text;













var html_template = "";
var filename = __filename.substr(0, __filename.lastIndexOf("/")+1) + "static/html_template.html";
var encoding = 'text';
sys.puts("loading " + filename + "...");
var promise = posix.cat(filename, encoding);
promise.addCallback(function(data) {
	sys.puts("static file " + filename + " loaded");
	html_template = data;
});
promise.addErrback(function() {
	sys.puts("Error loading " + filename);
});




/*
var app = server.makeApp([
    ['^/$', function(req, res) {
        server.respond(res, '<h1>djangode demo</h1> \
            <ul> \
                <li><a href="/delayed/1000">1 second delay page</a></li> \
                <li><a href="/error">Error page with stacktrace</a></li> \
                <li><a href="/404">Default 404</a></li> \
                <li><a href="/redirect">Redirect back to /</a></li> \
                <li><a href="/static-demo/hello.txt">Static hello.txt</a></li> \
            </ul> \
        ');
    }],
    ['^/delayed/(\\d+)$', function(req, res, howlong) {
        setTimeout(function() {
            server.respond(res, 'I delayed for ' + howlong);
        }, parseInt(howlong, 10));
    }],
    ['^/error$', function(req, res) {
        "bob"("not a function"); // Demonstrates stacktrace page
    }],
    ['^/redirect$', function(req, res) {
        server.redirect(res, '/');
    }],
    ['^/favicon\.ico$', function(req, res) {
        server.respond(res, 'Nothing to see here');
    }],
    ['^/(.*)$', server.serveFile] // Serve files from static-demo/
]);
 
server.serve(app, 9000);
*/