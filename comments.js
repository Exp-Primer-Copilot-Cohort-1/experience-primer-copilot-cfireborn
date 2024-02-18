// Create web server
 var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var comments = require('./comments');
var mime = require('mime');
var cache = {};

var server = http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;
	var realPath = path.join("assets", pathname);
	var ext = path.extname(realPath);
	ext = ext ? ext.slice(1) : 'unknown';
	console.log("Request for " + realPath + " received.");
	
	fs.exists(realPath, function(exists) {
		if (!exists) {
			res.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			res.write("This request URL " + pathname + " was not found on this server.");
			res.end();
		} else {
			var contentType = mime.lookup(realPath);
			fs.readFile(realPath, "binary", function(err, file) {
				if (err) {
					res.writeHead(500, {
						'Content-Type': 'text/plain'
					});
					res.end(err);
				} else {
					res.writeHead(200, {
						'Content-Type': contentType
					});
					res.write(file, "binary");
					res.end();
				}
			});
		}
	});
});

server.listen(3000);
console.log("Server is running at http://");
