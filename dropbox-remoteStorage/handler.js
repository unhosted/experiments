exports.handler = (function() {
  var dbox = require('dbox'),
    url = require('url'),
    dropboxConfig = require('./dropboxConfig').dropboxConfig;
  var client = dbox.createClient(dropboxConfig);
  var request = null,
    session = null;
  function serve(req, res) {
    var urlObj = url.parse(req.url);
    console.log(urlObj);
    if(urlObj.pathname == '/') {
      res.writeHead(200);
      res.write('<html>connect to dropbox:');
      client.request_token(function(status, reply) {
        if(status==200) {
          res.end('First click <a href="https://www.dropbox.com/1/oauth/authorize?oauth_token='+reply.oauth_token+'" target="_blank">allow</a> and then <a href="/a?'+encodeURIComponent(JSON.stringify(reply))+'">connect</a>.');
        } else {
          res.end('oops '+status);
        }
      });
    } else if(urlObj.pathname == '/a') {
      var request;
      try {
        request = JSON.parse(decodeURIComponent(urlObj.search.substring(1)));
      } catch(e) {
        res.writeHead(200);
        res.end('oops! '+urlObj.hash);
        return;
      }
      client.access_token(request, function(status, reply) {
        res.writeHead(status);
        res.end('<html><a href="/put?'+encodeURIComponent(JSON.stringify(reply))+'" target="_blank">put</a> '
          +'<a href="/get?'+encodeURIComponent(JSON.stringify(reply))+'" target="_blank">get</a> '
          +'<a href="/delete?'+encodeURIComponent(JSON.stringify(reply))+'" target="_blank">delete</a> ');
      });
    } else if(urlObj.pathname == '/get') {
      var request;
      try {
        request = JSON.parse(decodeURIComponent(urlObj.search.substring(1)));
      } catch(e) {
        res.writeHead(200);
        res.end('oops! '+urlObj.search);
        return;
      }
      client.get('foo.txt', request, function(status, reply) {
        res.writeHead(status);
        res.end(reply);
      });
    } else if(urlObj.pathname == '/put') {
      var request;
      try {
        request = JSON.parse(decodeURIComponent(urlObj.search.substring(1)));
      } catch(e) {
        res.writeHead(200);
        res.end('oops! '+urlObj.search);
        return;
      }
      client.put('foo.txt', 'bar', request, function(status, reply) {
        res.writeHead(status);
        res.end(JSON.stringify(reply));
      });
    } else if(urlObj.pathname == '/delete') {
      var request;
      try {
        request = JSON.parse(decodeURIComponent(urlObj.search.substring(1)));
      } catch(e) {
        res.writeHead(200);
        res.end('oops! '+urlObj.search);
        return;
      }
      client.rm('foo.txt', request, function(status, reply) {
        res.writeHead(status);
        res.end(JSON.stringify(reply));
      });
    }
  }
  return {
    serve: serve
  };
})();
