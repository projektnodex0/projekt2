/*jslint node: true, unparam: true */
var nodestatic = require('node-static'),
	serw = new nodestatic.Server(),
	formidable = require('formidable'),
	fs = require('fs'),
	util = require('util'),
	http = require('http'),
	sys = require('sys'),
	walk = require('walk'),
	options,
	walker;
options = {
	followLinks: false
};
http.createServer(function (request, response) {
	'use strict';
    if (request.method.toLowerCase() === 'post') {
        var form = new formidable.IncomingForm();
        form.parse(request, function (err, fields, files) {
			fs.writeFile("./uploads/" + fields.filename, fields.content);
			response.writeHead(200, {'content-type': 'text/plain'});
            response.write('received upload:\n\n');
			response.end(util.inspect({fields: fields, files: files}));
        });
        return;
    }
	console.log(request.url);
	if (request.url === '/files') {
		response.writeHead(200, {'content-type': 'text/html'});
		response.write('<html><body><ul>');
		walker = walk.walk('./uploads', options);
		walker.on('file', function (root, file, next) {
			response.write('<li><a href="#" onclick="window.opener.document.location.href=\'index.html?file=' + file.name + '\';self.close();">' + file.name + '</a></li>');
			console.log(file.name);
			next();
		});
		walker.on("end", function () {
			response.write('</ul></body></html>');
			response.end();
		});
		return;
	}
	request.addListener('end', function () {
		serw.serve(request, response, function (err, result) {
			if (err) {
				response.writeHead(err.status, err.headers);
				response.write("Error " + err.status);
				response.end();
			}
		});
	});
}).listen(808);