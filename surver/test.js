var simpleStorage = require('./simpleStorage').simpleStorage,
  http = require('http');

simpleStorage.addToken('mich', 'asdf', 'documents', function(){
  console.log('token added');
  http.createServer(simpleStorage.serve).listen(8000);
  console.log("curl -X'PUT' http://localhost:8000/mich/documents/foo -d'bar' -H'Authorization: Bearer asdf'");
  console.log("curl -X'GET' http://localhost:8000/mich/documents/foo -H'Authorization: Bearer asdf'");
  console.log("curl -X'DELETE' http://localhost:8000/mich/documents/foo -H'Authorization: Bearer asdf'");
});
