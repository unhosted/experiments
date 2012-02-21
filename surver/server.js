var http = require('http'),
  simpleStorage = require('./simpleStorage').simpleStorage,
  handler = require('./handler').handler,
  config = require('./config').config;
 
function serve(req, res) {
  return handler.serve(req, res, '.');
}
simpleStorage.addUser('test@surf.unhosted.org', 'asdf', function() {
  console.log('created user test@surf.unhosted.org = asdf');
});
http.createServer(serve).listen(config.port);
console.log('Server running at ports '+config.port); 
