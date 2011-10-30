var http = require('http'),
    url = require('url'),
    httpProxy = require('http-proxy');

httpProxy.createServer(function (req, res, proxy) {
  var host = req.headers.host.split(':')[0];
  console.log(host)
  if(host=='yourremotestorage.com') {
    console.log('backend: remoteCouch');
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: 8003
    });
  } else { 
    console.log('backend: statics');
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: 8004
    });
  }
}).listen(80);
