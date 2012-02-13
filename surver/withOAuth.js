(function() {
  var simpleStorage = require('./simpleStorage').simpleStorage,
    http = require('http'),
    url = require('url'),
    querystring = require('querystring');
  function genToken() {
    return 'yo-ho';
  }
  function serveOAuth(req, res) {
    if(req.method=='POST') {
      var dataStr = '';
      req.on('data', function(chunk) {
        dataStr += chunk;
      });
      req.on('end', function() {
        var incoming = querystring.parse(dataStr);
        var token = genToken();
        simpleStorage.createToken(incoming.userId, incoming.password, token, incoming.categories, function(result) {
          if(result) {
            console.log('yes: '+token);
            res.writeHead(301, {
              Location: incoming.redirectUri+'#access_token='+token
            });
            res.end();
          } else {
            console.log('no: '+token);
            res.writeHead(200);
            res.end('<!DOCTYPE html><head><meta charset="utf-8"><title>OAuth</title></head><body>'
              +'Sorry, thats not right'
              +'</body></html>');
          }
        });
      });
    } else {
      var urlObj = url.parse(req.url, true);
      if(urlObj.query.redirect_uri) {
        res.writeHead(200);
        res.end('<!DOCTYPE html><head><meta charset="utf-8"><title>OAuth</title></head><body><form method="POST" target="?">'
          +'UserId: <input name="userId">'
          +'Password: <input name="password">'
          +'<input type="hidden" name="redirectUri" value="'+urlObj.query.redirect_uri+'">'
          +'<input type="submit" value="Allow">'
          +'</form></body></html>');
      } else {
        res.writeHead(200);
        res.end('<!DOCTYPE html><head><meta charset="utf-8"><title>OAuth</title></head><body>'
          +'Please add ?redirect_uri=http://localhost/bla to the address'
          +'</body></html>');
      }
    }
  }
  simpleStorage.addUser('mich', 'asdf', function() {
    http.createServer(function(req, res) {
      var urlObj = url.parse(req.url);
      console.log(urlObj);
      var pathNameParts = urlObj.pathname.split('/');
      if(pathNameParts[1] == '_oauth') {
        serveOAuth(req, res);
      } else {
        simpleStorage.serve(req, res);
      }
    }).listen(8000);
    console.log('http://localhost/_oauth (mich/asdf)');
  });
})();
