var httpProxy = require('http-proxy'),
    config = require('./config').config;

httpProxy.createServer(function (req, res, proxy) {
  var host = req.headers.host.split(':')[0];
  console.log(host)

  var portToUse = config.vhosts[host]
  if(!portToUse) {
    portToUse = config.defaultPort;
  }
  console.log('backend port for '+host+': '+portToUse);
  proxy.proxyRequest(req, res, {
    host: 'localhost',
    port: portToUse
  });
}).listen(80);
