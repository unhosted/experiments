(function() {
  var simpleStorage = require('./simpleStorage').simpleStorage,
    http = require('http'),
    url = require('url'),
    querystring = require('querystring'),
    config = require('./config').config;
  function genToken() {
    return 'yo-ho';
  }
  function genHostMeta(baseUrl) {
    return '<?xml version=\'1.0\' encoding=\'UTF-8\'?>\n'
      +'<XRD xmlns=\'http://docs.oasis-open.org/ns/xri/xrd-1.0\'\n'
      +'     xmlns:hm=\'http://host-meta.net/xrd/1.0\'>\n'
      +'     <hm:Host></hm:Host>\n'
      +'  <Link rel=\'lrdd\'\n'
      +'        template=\''+baseUrl+'/webfinger/{uri}\'>\n'
      +'    <Title>Resource Descriptor</Title>\n'
      +'  </Link>\n'
      +'</XRD>\n';
  }
  function genWebfinger(baseUrl, userId) {
    return '<?xml version=\'1.0\' encoding=\'UTF-8\'?>\n'
      +'<XRD xmlns=\'http://docs.oasis-open.org/ns/xri/xrd-1.0\'\n'
      +'     xmlns:hm=\'http://host-meta.net/xrd/1.0\'>\n'
      +'     <hm:Host></hm:Host>\n'
      +'  <Link rel=\'remoteStorage\'\n'
      +'        api=\'simple\'\n'
      +'        auth=\''+baseUrl+'/_oauth/'+userId+'\'\n'
      +'        template=\''+baseUrl+'/'+userId+'/{category}/\'>\n'
      +'    <Title>Resource Descriptor</Title>\n'
      +'  </Link>\n'
      +'</XRD>\n';
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
        console.log(incoming);
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
            res.end('<!DOCTYPE html><head><meta charset="utf-8"><title>OAuth</title></head><body>\n'
              +'Sorry, thats not right\n'
              +'</body></html>\n');
          }
        });
      });
    } else {
      var urlObj = url.parse(req.url, true);
      if(urlObj.query.redirect_uri) {
        var pathNameParts = urlObj.pathname.split('/');
        res.writeHead(200);
        res.end('<!DOCTYPE html><head><meta charset="utf-8"><title>OAuth</title></head><body><form method="POST" target="?">\n'
          +'UserId: <input name="userId" value="'+pathNameParts[2]+'"><br>\n'
          +'Password: <input name="password"><br>\n'
          +'<input type="hidden" name="redirectUri" value="'+urlObj.query.redirect_uri+'">\n'
          +'<input type="submit" value="Allow">\n'
          +'</form></body></html>\n');
      } else {
        res.writeHead(200);
        res.end('<!DOCTYPE html><head><meta charset="utf-8"><title>OAuth</title></head><body>\n'
          +'Please add ?redirect_uri=http://localhost/bla to the address\n'
          +'</body></html>\n');
      }
    }
  }
  simpleStorage.addUser('acct:test@unhosted.org', 'asdf', function() {
    http.createServer(function(req, res) {
      var urlObj = url.parse(req.url);
      console.log(urlObj);
      var pathNameParts = urlObj.pathname.split('/');
      if(pathNameParts[1] == '.well-known') {
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*'});
        res.end(genHostMeta(config.origin));
      } else if(pathNameParts[1] == 'webfinger') {
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*'});
        res.end(genWebfinger(config.origin, pathNameParts[2]));
      } else if(pathNameParts[1] == '_oauth') {
        serveOAuth(req, res);
      } else {
        simpleStorage.serve(req, res);
      }
    }).listen(80);
    console.log('http://localhost:8000/_oauth/acct:test@unhosted.org?redirect_uri=http://localhost/rcvToken.html (password: asdf)');
  });
})();
