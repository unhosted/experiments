exports.handler = (function() {
  var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    config = require('./config').config;
   
  function serveFile(res, filename, contentType) {
    fs.readFile(filename, 'binary', function(err, file) {
      if(err.code == 'EISDIR') {
        res.writeHead(301, {'Location': 'http://'+host+uripath+'/'});
        res.end('Location: http://'+host+uripath+'/\n');
      } else if(err) {
        console.log(err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err + '\n');
      } else {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': contentType
        });
        res.write(file, 'binary');
        res.end();
      }
    });
  }
  function serve(req, res, baseDir) {
    var uripath = url.parse(req.url).pathname
      .replace(new RegExp('/$', 'g'), '/index.html');
    var host = req.headers.host;
    if(config.redirect && config.redirect[host]) {
      res.writeHead(302, {'Location': config.redirect[host]+uripath});
      res.write('302 Location: '+config.redirect[host]+uripath+'\n');
      res.end();
      return;
    }
    console.log(host);
    console.log(req.url);
    console.log(uripath);
    var filename;
    if(config.path && config.path[host + uripath]) {
      filename = baseDir + '/' + config.path[host + uripath];
    } else if(config.host && config.host[host]) {
      filename = baseDir + '/' + config.host[host] + uripath;
    } else {
      filename = baseDir + '/' + config.default + uripath;
    }
    var contentType;
    if(/\.appcache$/g.test(uripath)) {
      contentType='text/cache-manifest';
    } else if(/\.html$/g.test(uripath)) {
      contentType='text/html';
    } else if(/\.css$/g.test(uripath)) {
      contentType='text/css';
    } else if(/\.js$/g.test(uripath)) {
      contentType='text/javascript';
    } else if(/\.png$/g.test(uripath)) {
      contentType='image/png';
    } else if(/\.svg$/g.test(uripath)) {
      contentType='image/svg+xml';
    } else if(/host-meta$/g.test(uripath)) {
      contentType='application/xml+xrd';
    } else if(/webfinger$/g.test(uripath)) {
      contentType='application/xml+xrd';
    } else {
      contentType='text/plain';
    }
    path.exists(filename, function(exists) { 
      if(exists) {
        serveFile(res, filename, contentType);
      } else {
        //try adding .html:
        var filename2 = filename+'.html';
        path.exists(filename2, function(exists2) { 
          if(exists2) {
            contentType='text/html';
            serveFile(res, filename2, contentType);
          } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
              res.write('404 Not Found\n'+filename);
              res.end();
          }
        });
      }
    });
  }

  return {
    serve: serve
  };
})();
