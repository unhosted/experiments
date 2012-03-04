var http = require('http'),
  handler = require('./handler').handler;
 
function serve(req, res) {
  return handler.serve(req, res);
}
http.createServer(handler.serve).listen(80);
console.log('Server running at port 80'); 
