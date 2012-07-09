exports.handler = (function() {
  var url=require('url'),
    crypto=require('crypto'),
    config = {
      protocol: 'http',
      host: 'mich.rs'
    }, tokens = {}, data = {};
  function createToken(userName, scopes, cb) {
    crypto.randomBytes(48, function(ex, buf) {
      var token = buf.toString('hex');
      for(var i=0; i<scopes.length; i++) {
        scopes[i]=userName+'/'+scopes[i];
      }
      tokens[token] = scopes;
      cb(token);
    });
  }
  function writeJson(res, obj, origin) {
    res.writeHead(200, {
      'access-control-allow-origin': (origin?origin:'*'),
      'access-control-allow-headers': 'Content-Type, Authorization, Origin',
      'content-type': 'application/json'
    });
    res.write(JSON.stringify(obj));
    res.end();
  }
  function writeHtml(res, html) {
    res.writeHead(200, {
      'content-type': 'text/html'
    });
    res.write('<!DOCTYPE html lang="en"><head><title>'+config.host+'</title><meta charset="utf-8"></head><body>'+html+'</body></html>');
    res.end();
  }
  function toHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function webfinger(urlObj, res) {
    if(urlObj.query['resource']) {
      userAddress = urlObj.query['resource'].substring('acct:'.length);
      userName = userAddress.split('@')[0];
    }
    writeJson(res, {
      links:[{
        href: config.protocol+'://'+config.host+'/storage/'+userName,
        rel: "remoteStorage",
        type: "https://www.w3.org/community/rww/wiki/read-write-web-00#simple",
        properties: {
          'auth-method': "https://tools.ietf.org/html/draft-ietf-oauth-v2-26#section-4.2",
          'auth-endpoint': config.protocol+'://'+config.host+'/auth/'+userName
        }
      }]
    });
  }
  function oauth(urlObj, res) {
    var scopes = decodeURIComponent(urlObj.query['scope']).split(' '),
      clientId = decodeURIComponent(urlObj.query['client_id']),
      redirectUri = decodeURIComponent(urlObj.query['redirect_uri']),
      clientIdToMatch,
      userName;
    if(redirectUri.split('://').length<2) {
      clientIdToMatch=redirectUri;
    } else {
      clientIdToMatch = redirectUri.split('://')[1].split('/')[0];
    }
    if(clientId != clientIdToMatch) {
      writeHtml(res, 'we do not trust this combination of client_id and redirect_uri');
    } else {
      var userName = urlObj.pathname.substring('/auth/');
      createToken(userName, scopes, function(token) {
        writeHtml(res, '<a href="'+toHtml(redirectUri)+'#access_token='+toHtml(token)+'">Allow</a>');
      });
    }
  }
  function storage(req, urlObj, res) {
    var path=urlObj.pathname.substring('/storage'.length);
    if(req.method=='OPTIONS') {
      writeJson(res, null, req.headers.origin);
    } else if(req.method=='GET') {
      if(mayRead(req.headers.authorization, path)) {
        writeJson(res, data[path], req.headers.origin);
      } else {
        computerSaysNo();
      }
    } else if(req.method=='PUT') {
      if(mayWrite(req.headers.authorization, path)) {
        var dataStr = '';
        req.on('data', function(chunk) {
          dataStr+=chunk;
        });
        req.on('end', function(chunk) {
          data[path]=dataStr;
          var pathParts=path.split('/');
          var timestamp=123;
          while(pathParts.length) {
            var thisPart = pathParts.pop();
            if(!data[pathParts.join('/')+'/']) {
              data[pathParts.join('/')+'/'] = {};
            }
            data[pathParts.join('/')+'/'][thisPart]=timestamp;
          }
          writeJson(res, null, req.headers.origin);
        });
      } else {
        computerSaysNo();
      }
    } else if(req.method=='DELETE') {
      if(mayWrite(req.headers.authorization, path)) {
          delete data[path];
          var pathParts=path.split('/');
          var thisPart = pathParts.pop();
          if(data[pathParts.join('/')+'/']) {
            delete data[pathParts.join('/')+'/'][thisPart];
          }
          writeJson(res, null, req.headers.origin);
      } else {
        computerSaysNo();
      }
    }
  }
  function serve(req, res, staticsMap) {
    var urlObj = url.parse(req.url, true), userAddress, userName;
    console.log(urlObj);
    if(req.method == 'GET') {
      if(urlObj.pathname == '/.well-known/host-meta.json') {//TODO: implement rest of webfinger
        return webfinger(urlObj, res);
      } else if(urlObj.pathname.substring(0, '/auth/'.length) == '/auth/') {
        return oauth(urlObj, res);
      }
    } else if(urlObj.pathname.substring(0, '/storage/'.length) == '/storage/') {
      storage(req, urlObj, res);
    } else {
      writeJson(res, urlObj.query);
    }
  }

  return {
    serve: serve
  };
})();
