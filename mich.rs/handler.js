exports.handler = (function() {
  var url=require('url'),
    crypto=require('crypto'),
    config = {
      protocol: 'http',
      host: 'mich.rs'
    }, tokens = {};
  function createToken(userName, scopes, cb) {
    crypto.randomBytes(48, function(ex, buf) {
      var token = buf.toString('hex');
      tokens[token] = {
        userName: userName,
        scopes: scopes
      };
      cb(token);
    });
  }
  function writeJson(res, obj) {
    res.writeHead(200, {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'Content-Type',
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
  function serve(req, res, staticsMap) {
    var urlObj = url.parse(req.url, true), userAddress, userName;
    console.log(urlObj);
    if(req.method == 'GET') {
      if(urlObj.pathname == '/.well-known/host-meta.json') {//TODO: implement rest of webfinger
        if(urlObj.query['resource']) {
          userAddress = urlObj.query['resource'].substring('acct:'.length);
          userName = userAddress.split('@')[0];
        }
        writeJson(res, {
          links:[{
            href: config.protocol+'://'+config.host+'/storage/'+userName+'/',
            rel: "remoteStorage",
            type: "https://www.w3.org/community/rww/wiki/read-write-web-00#simple",
            properties: {
              'auth-method': "https://tools.ietf.org/html/draft-ietf-oauth-v2-26#section-4.2",
              'auth-endpoint': config.protocol+'://'+config.host+'/auth/'+userName+'/'
            }
          }]
        });
        return;
      } else if(urlObj.pathname.substring(0, '/auth/'.length) == '/auth/') {
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
        return;
      }
    } else if(urlObj.pathname.substring(0, '/storage/'.length) == '/storage/') {
        writeJson(res, urlObj.query);
    } else {
      writeJson(res, urlObj.query);
    }
  }

  return {
    serve: serve
  };
})();
