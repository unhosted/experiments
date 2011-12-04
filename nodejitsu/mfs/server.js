var http = require('http'),
  https = require('https'),
  fs = require('fs'),
  handler = require('./handler').handler,
  config = require('./config').config;
 
function serve(req, res) {
  return handler.serve(req, res, '.');
}
http.createServer(serve).listen(config.port);
https.createServer({
  ca:fs.readFileSync(config.sslDir +'sub.class1.server.ca.pem'),
  key:fs.readFileSync(config.sslDir +'ssl.key'),
  cert:fs.readFileSync(config.sslDir +'ssl.crt')
}, serve).listen(config.sslPort);
console.log('Server running at ports '+config.port+' and '+config.sslPort); 
