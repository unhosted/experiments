var httpProxy = require('http-proxy'),
    config = require('./config').config;

httpProxy.createServer(function (req, res, proxy) {
  console.log(':>');
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
  console.log('<:');
}).listen(80);
console.log('vhostRouter running on port 80, backends:');
console.log(config.backends);
