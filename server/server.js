/* Author: Gabriel Walt */
/* Minimalistic Web Server (node.js v0.4.12) */

// Dependencies ////////////////////////////////////////////////////////////////

var http   = require("http"),
    url    = require("url"),
    path   = require("path"),
    fs     = require("fs"),
    config = require("./config.js"),
    mime   = require("./lib/mime.js")("text/html"),
    mu     = require("./lib/mu");

// Initialization ////////////////////////////////////////////////////////////////

if (process.argv.length < 4) {
    console.log("\nSyntax:\nnode server.js 127.0.0.1 8080\n");
    return;
}

config.fileNotFoundFile  = path.join(process.cwd(), path.normalize(config.contentRoot+"/"+config.fileNotFound));
config.internalErrorFile = path.join(path.normalize(config.contentRoot+"/"+config.internalError));
config.serverHost = process.argv[2];
config.serverPort = process.argv[3];
mu.templateRoot = config.templateRoot;

// Server ////////////////////////////////////////////////////////////////

http.createServer(function (request, response) {
    try {
        var uri = config.contentRoot + url.parse(request.url).pathname,
            file = path.join(process.cwd(), uri);
        
        serveOrRender(request, response, file);
        
    } catch (err) { serverError(request, response, err); }
    
}).listen(config.serverPort, config.serverHost);

console.log("Server running at http://"+config.serverHost+":"+config.serverPort+"/");

// Functions ////////////////////////////////////////////////////////////////

// Verifies if the requested file exists as on the file system, or if it exists as JSON format and needs to be rendered
function serveOrRender(request, response, file, statusCode) {
    // Setting default value of optional argument
    statusCode = statusCode || 200;
    
    fs.stat(file, function (err, stats) {
        try {
            if (!err && stats.isFile()) {
                // It does exist, serve it!
                serveFile(request, response, file);
            
            } else if (!err && stats.isDirectory()) {
                // Look if there is an index.html file present (or index.json)
                serveOrRender(request, response, path.normalize(file+"/"+config.defaultFile));
            
            } else {
                // Check if a JSON version of the requested HTML document exists
                if (file.slice(file.length-5) == ".html") {
                    var jsonFile = file.slice(0, file.length-5) + ".json";
    
                    // Check if the JSON file exists by trying to read it
                    fs.readFile(jsonFile, function (err, content) {
                        try {
                            if (err) {
                                pageNotFound(request, response, statusCode);
                            } else {
                                // It does exists, parse it and render template!
                                renderTemplate(request, response, content, statusCode);
                            }
                        } catch (err) { serverError(request, response, err); }
                    });
                } else {
                    pageNotFound(request, response, statusCode);
                }
            }
        } catch (err) { serverError(request, response, err); }
    });
}

// Inject the given data into the appropriate template
function renderTemplate(request, response, content, statusCode) {
    var json = JSON.parse(content);
    
    // Setting default value of optional argument
    statusCode = statusCode || 200;
    
    if (json.template) {
        mu.render(json.template, json, {}, function (err, output) {
            try {
                if (err) {
                    serverError(request, response, err, true);
                } else {
                    console.log("200 "+request.url);
                    response.writeHead(statusCode, {"Content-Type": "text/html"});
                    output
                        .addListener("data", function (c) { response.write(c); })
                        .addListener("end", function () { response.end(); });
                }
            } catch (err) { serverError(request, response, err, true); }
        });
    } else {
        serverError(request, response, "Template property is missing on content.", true);
    }

}

// Send back a file from the file system
function serveFile(request, response, file, statusCode) {
    var contentType = mime(file);
    
    // Setting default value of optional argument
    statusCode = statusCode || 200;
    
    fs.readFile(file, "binary", function (err, file) {
        if (err) {
            serverError(request, response, err, true);
        } else {
            response.writeHead(statusCode, {"Content-Type": contentType});
            response.write(file, "binary");
            response.end();
        }
        console.log(statusCode+" "+request.url);
    });
}

function pageNotFound(request, response, statusCode) {
    if (statusCode == 200) {
        serveOrRender(request, response, config.fileNotFoundFile, 404);
    } else {
        serverError(request, response, "Cannot find error page for status code "+statusCode, (statusCode==500));
    }
}

// Display error page and log
function serverError(request, response, err, dontRender) {
    if (dontRender) {
        statusCode = 500;
        response.writeHead(statusCode, {"Content-Type": "text/plain"});
        response.write(err+"\n");
        response.end();
    } else {
        serveOrRender(request, response, config.internalErrorFile, 500);
    }
    if (err) {
        if (err.message && err.stack) {
            console.error(err.message);
            console.error(err.stack);
        } else {
            console.error(err);
        }
    }
}
