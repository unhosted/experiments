exports.handler = (function() {
  var url = require('url'),
    querystring = require('querystring'),
    browseridVerifier = require('browserid-verifier');
   
  function serve(req, res, baseDir) {
    var urlObj = url.parse(req.url, true);
    console.log(urlObj);
    res.writeHead(200, {'Content-type': 'application/json'});
    res.write(JSON.stringify({email: 'michielbdejong@iriscouch.com'}));
    res.end();
  }

  return {
    serve: serve
  };
})();
