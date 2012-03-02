var http = require('http'),
  handler = require('./handler').handler,
  config = require('./config').config;
 
function serve(req, res) {
  return handler.serve(req, res, '.');
}
http.createServer(serve).listen(80);
console.log('Server running at port 80'); 
