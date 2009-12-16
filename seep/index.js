//var server = require("./server");
var sys = require("sys");
var http = require("http");
var posix = require("posix");


// Map from URI to app
var apps = {};


/**
 * Add new Seep application
 */
exports.add = function(app, uri) {
	if(typeof apps[uri] != "undefined") {
		sys.puts("Application already specified for URI "+uri);
		return;
	}
	sys.puts("Adding app "+app.name);
	apps[uri] = app;
	return app;
}


var handleRequest = function(req, res) {
	for(uri in apps) {
		if(uri == req.uri.path) {
			res.sendHeader(200, {"Content-Type": "text/plain"});
  			res.sendBody(apps[uri].name+ "("+uri+")");
  			res.finish();
  			return;
  		}
	}
	// Default response (404)
	res.sendHeader(404, {"Content-Type": "text/html"});
  	res.sendBody("<h1>404</h1><p>Not found</p>");
  	res.finish();
}



exports.start = function(port) {
	for(var app in apps) {
		//sys.puts("Starting app "+apps[app].name);
		
	}
	http.createServer(handleRequest).listen(port);
	sys.puts("Seep server running at port "+port);
}








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