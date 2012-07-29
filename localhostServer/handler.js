exports.handler = (function() {
  var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    config = require('./config').config;
   
  function serve(req, res, staticsMap) {
    var uripath = url.parse(req.url).pathname
      .replace(new RegExp('/$', 'g'), '/index.html');
    var host = req.headers.host;
    if(config.redirect && config.redirect[host]) {
      res.writeHead(302, {'Location': 'http://'+config.redirect[host]});
      res.write('302 Location: http://'+config.redirect[host]+'\n');
      res.end();
      return;
    }
    console.log(host);
    console.log(req.url);
    console.log(uripath);
    var filename;
    if(config.pathHandler && config.pathHandler[host + uripath]) {
      console.log('found handler:'+config.pathHandler[host + uripath]);
      return require(config.pathHandler[host + uripath]+'/handler').handler.serve(req, res, config.pathHandler[host + uripath]);
    } else if (config.handler && config.handler[host]) {
      var module;
      if(config.handler[host].substr(-3) == '.js') {
        module = config.handler[host].substring(0, config.handler[host].length-3);
      } else {
        module = config.handler[host]+'/handler';
      }
      console.log('found handler:'+module);
      return require(module).handler.serve(req, res, config.handler[host]);
    } else if(config.path && config.path[host + uripath]) {
      filename = config.path[host + uripath];
    } else if(config.host && config.host[host]) {
      filename = config.host[host] + uripath;
    } else {
      filename = config.default + uripath;
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
    } else if(/\.gif$/g.test(uripath)) {
      contentType='image/gif';
    } else if(/\.png$/g.test(uripath)) {
      contentType='image/png';
    } else if(/\.svg$/g.test(uripath)) {
      contentType='image/svg+xml';
    } else {
      contentType='text/plain';
    }
    console.log(filename);
    console.log(contentType);

    path.exists(filename, function(exists) { 
      if(!exists) { 
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 Not Found\n'+filename);
        res.end();
        return;
      } 
   
      fs.readFile(filename, 'binary', function(err, file) {
        console.log(err);
        if(err && err.code == 'EISDIR') {
          res.writeHead(301, {'Location': 'http://'+host+uripath+'/'});
          res.end('Location: http://'+host+uripath+'/\n');
        } else if(err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end(typeof(err) + '"' + err + '"\n');
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
    })
  }

  return {
    serve: serve
  };
})();
