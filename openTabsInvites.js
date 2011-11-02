var http = require('http');
http.createServer(function (req, res) {
  req.on('data', function(data) {
    console.log('DATA:'+data);
  });
  req.on('end', function(data) {
    console.log('END');
  });
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/plain'});
  res.end('Thanks!\n');
}).listen(1605);
console.log('Server running at http://127.0.0.1:1605/');
