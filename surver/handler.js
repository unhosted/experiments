exports.handler = (function() {
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
  function genWebfinger(api, authUrl, template) {
    return '<?xml version=\'1.0\' encoding=\'UTF-8\'?>\n'
      +'<XRD xmlns=\'http://docs.oasis-open.org/ns/xri/xrd-1.0\'\n'
      +'     xmlns:hm=\'http://host-meta.net/xrd/1.0\'>\n'
      +'     <hm:Host></hm:Host>\n'
      +'  <Link rel=\'remoteStorage\'\n'
      +'        api=\''+api+'\'\n'
      +'        auth=\''+authUrl+'\'\n'
      +'        template=\''+template+'\'>\n'
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
        var categories = incoming.scope.split(',');
        simpleStorage.createToken(incoming.userId, incoming.password, token, categories, function(result) {
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
        res.end('<!DOCTYPE html><head><meta charset="utf-8"><title>OAuth</title></head><body><form method="POST">\n'
          +'UserId: <input name="userId" value="'+pathNameParts[2]+'"><br>\n'
          +'Password: <input name="password"><br>\n'
          +'<input type="hidden" name="redirectUri" value="'+urlObj.query.redirect_uri+'">\n'
          +'<input type="hidden" name="scope" value="'+urlObj.query.scope+'">\n'
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
  function verifyAssertion(assertion, email) {
    return true;
  }
  function serveBrowserID(req, res) {
    var dataStr='';
    req.on('data', function(chunk) {
      dataStr+= chunk;
    });
    req.on('end', function(chunk) {
      var incoming = querystring.parse(dataStr);
      if(verifyAssertion(incoming.assertion, incoming.userId)) {
        var token = genToken();
        console.log(incoming.userId);
        console.log(token);
        console.log(JSON.parse(incoming.scope));
        simpleStorage.addToken(incoming.userId, token, JSON.parse(incoming.scope), function() {
          res.writeHead(301, {
            Location: incoming.redirectUri+'#access_token='+token
          });
          res.end();
        });
      }
    });
  }
  simpleStorage.addUser('acct:test@surf.unhosted.org', 'asdf', function() {
    console.log('user test@surf.unhosted.org created, password asdf');
  });
  function serve(req, res) {
    var urlObj = url.parse(req.url);
    console.log(urlObj);
    var pathNameParts = urlObj.pathname.split('/');
    if(pathNameParts[1] == '.well-known') {
      console.log('case 1: host-meta');
      res.writeHead(200, {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/xrd+xml'});
      res.end(genHostMeta(config.origin));
    } else if(pathNameParts[1] == 'webfinger') {
      console.log('case 2: webfinger');
      var userId = pathNameParts[2].substring('acct:'.length);
      var authUrl;
      if(!config.api) {
        config.api = 'simple';
      }
      if(!config.authUrl) {
        config.authUrl = config.origin+'/_oauth/'+userId;
      } else if(config.authUrl.indexOf('?') == -1) {
        config.authUrl += '?user_id='+userId;
      }
      if(!config.template) {
        config.template = config.origin+'/'+userId+'/{category}/';
      }
      res.writeHead(200, {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/xrd+xml'});
      res.end(genWebfinger(config.api, config.authUrl, config.template));
    } else if(pathNameParts[1] == '_browserid') {
      serveBrowserID(req, res);
    } else if(pathNameParts[1] == '_oauth') {
      console.log('case 3: OAuth');
      serveOAuth(req, res);
    } else {
      console.log('case 4: storage');
      simpleStorage.serve(req, res);
    }
  }
  return {
    serve: serve
  };
})();
