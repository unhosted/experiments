exports.handler = (function() {
  var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    config = require('./config').config;
   
  function serve(req, res, baseDir) {
    var uripath = url.parse(req.url).pathname
      .replace(new RegExp('/$', 'g'), '/index.html');
    var host = req.headers.host;
    if(config.redirect && config.redirect[host]) {
      res.writeHead(302, {'Location': config.redirect[host]});
      res.write('302 Location: '+config.redirect[host]+'\n');
      res.end();
      return;
    }
    var filename;
    if(config.pathHandler && config.pathHandler[host + uripath]) {
      console.log('found pathHandler for '+host+uripath+':'+config.pathHandler[host + uripath]);
      return require(config.pathHandler[host + uripath]+'/handler').handler.serve(req, res, config.pathHandler[host + uripath]);
    } else if (config.handler && config.handler[host]) {
      console.log('found handler for '+host+':'+config.handler[host]);
      return require(config.handler[host]+'/handler').handler.serve(req, res, config.handler[host]);
    } else if(config.path && config.path[host + uripath]) {
      console.log('found path for '+host+uripath+'...');
      filename = baseDir + config.path[host + uripath];
    } else if(config.host && config.host[host]) {
      console.log('found host for '+host+' (uripath was '+uripath+')...');
      filename = baseDir + config.host[host] + uripath;
    } else {
      console.log('found nothing, using default: "'+config.default+'"...');
      filename = baseDir +  config.default + uripath;
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
    } else if(/\.gif$/g.test(uripath)) {
      contentType='image/gif';
    } else if(/\.ico$/g.test(uripath)) {
      contentType='image/png';
    } else if(/\.svg$/g.test(uripath)) {
      contentType='image/svg+xml';
    } else {
      contentType='text/plain';
    }

    path.exists(filename, function(exists) { 
      if(!exists) { 
        console.log(filename+' not found');
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 Not Found\n'+filename);
        res.end();
        return;
      } 
   
      fs.readFile(filename, 'binary', function(err, file) {
        if(err && err.code == 'EISDIR') {
          console.log(filename+' is dir');
          res.writeHead(301, {'Location': 'http://'+host+uripath+'/'});
          res.end('Location: http://'+host+uripath+'/\n');
        } else if(err) {
          console.log(filename+' err '+err);
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end(err + '\n');
        } else {
          console.log(filename+' ok');
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
