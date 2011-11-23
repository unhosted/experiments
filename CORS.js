var http = require('http'),
  config = require('./config').config;

  ////////////////
 // CORS proxy //
////////////////

http.createServer(function (req, res) {
  var subdomain = (req.headers.host.split('.'))[0];
  console.log('detected subdomain "'+subdomain+'"');

  var dataStr = '';
  req.on('data', function(chunk) {
    dataStr += chunk;
    console.log('A:'+chunk);
  });
  req.on('end', function() {
    console.log('A:END');
    var options = {
      'host': subdomain+'.'+config.couch.parentDomain,
      'port': config.couch.port,
      'method': req.method,
      'path': req.url,
      'headers': req.headers
    };
    if(req.method=='OPTIONS') {
      responseHeaders={}//should maybe get a base set from remote?
      var origin = req.headers.Origin;
      if(!origin) {
        origin = '*';
      }
      responseHeaders['Access-Control-Allow-Origin'] = origin;
      responseHeaders['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE';
      responseHeaders['Access-Control-Allow-Headers'] = 'authorization,content-type,Content-Length,gdata-version,slug,x-upload-content-length,x-upload-content-type';
      responseHeaders['Access-Control-Allow-Credentials'] = 'true';
      res.writeHead(200, responseHeaders);
      res.end();
    } else {
      //stop the remote server getting confused trying to serve a vhost for the proxy's url instead of its own one:
      options.headers.host = options.host;

      //cunning trick that works because of how our bearer tokens relate to our CouchDb passwords:
      if(options.headers['authorization']) {
        var bearerToken = options.headers['authorization'].substring(('Bearer '.length));
        options.headers['authorization'] = 'Basic '+bearerToken;
      }
      if(options.headers['Authorization']) {
        var bearerToken = options.headers['Authorization'].substring(('Bearer '.length));
        options.headers['Authorization'] = 'Basic '+bearerToken;
      }

      console.log('\nB.OPTIONS:'+JSON.stringify(options));
      var req2 = http.request(options, function(res2) {
        var responseHeaders = res2.headers;
        console.log('\nC.HEADERS:'+JSON.stringify(responseHeaders));
        var origin = req.headers.Origin;
        if(!origin) {
          origin = '*';
        }
        responseHeaders['Access-Control-Allow-Origin'] = origin;
        responseHeaders['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE';
        responseHeaders['Access-Control-Allow-Headers'] = 'authorization,content-type,Content-Length,gdata-version,slug,x-upload-content-length,x-upload-content-type';
        responseHeaders['Access-Control-Allow-Credentials'] = 'true';
        res.writeHead(res2.statusCode, responseHeaders);
        res2.setEncoding('utf8');
        var res2Data = '';
        res2.on('data', function (chunk) {
          res2Data += chunk;
        });
        res2.on('end', function() {
          console.log('\nC.DATA:'+res2Data);
          res.write(res2Data);
          res.end();
        });
      });
      //console.log('example.DATA:'+JSON.stringify({ingredients:['bacon', 'cheese']}));
      console.log('B.DATA:'+dataStr);
      req2.write(dataStr);
      req2.end();
    }
  });
}).listen(config.backends.proxy);
console.log('listening on '+config.backends.proxy);
