var http = require('http'),
  https = require('https'),
  sys = require('util'),
  irc = require('irc');

var client = new irc.Client('irc.freenode.net', 'michbot', {
  channels: ['#unhostedmonitor'],
});
client.addListener('registered', function(message) {
  console.log('registered: '+message);

  client.join('#unhostedtest', function() {
    console.log('joined');

    function reportError(err) {
      console.log('saying "'+err+'" in chan');
      client.say('#unhostedmonitor', err);
    }

    function check(lib, testName, reqOptions, reqBody, expected, cb) {
      var req = lib.request(reqOptions, function(res) {
        if(res.statusCode != expected.statusCode) {
          cb(1, testName+' - status code '+res.statusCode+' instead of '+expected.statusCode);
          return;
        }
        res.setEncoding('utf8');
        var dataStr = '';
        res.on('data', function(chunk) {
          dataStr += chunk;
        });
        res.on('end', function() {
          if(dataStr.indexOf(expected.dataStr) == -1) {
            cb(2, testName+' - dataStr '+dataStr+' instead of '+expected.dataStr);
            return;
          }
          cb(null, testName+' - pass');
        });
      });
      req.on('error', function(e) {
        cb(3, testName+' - error: '+e.message);
      });
      req.write(reqBody);
      req.end();
    }

    function checkStoreBearerToken(testName, str) {
      check(http, testName, {
        host: 'mich.libredocs.org',
        port: 80,
        path: '/storeBearerToken',
        method: 'POST',
      }, str, {
        statusCode: 201,
        dataStr: 'ok'
      }, function(err, data) {
        if(err) {
          reportError(data);
        }
        console.log(data);
      });
    }

    function checkHostMeta(testName, host, str) {
      check(https, testName, {
        host: host,
        port: 443,
        path: '/.well-known/host-meta',
        method: 'GET',
      }, '', {
        statusCode: 200,
        dataStr: str
      }, function(err, data) {
        if(err) {
          reportError(data);
        }
        console.log(data);
      });
    }

    function checkWebsite(testName, host, str) {
      check(http, testName, {
        host: host,
        port: 80,
        path: '/',
        method: 'GET',
      }, '', {
        statusCode: 200,
        dataStr: str
      }, function(err, data) {
        if(err) {
          reportError(data);
        }
        console.log(data);
      });
    }
    setInterval(function() {
      console.log('checking...');
      checkStoreBearerToken('storeBearerToken 5apps', '{"userAddress":"michiel@5apps.com","bearerToken":"db2e83efc029a92e037f4c68bc59cf73"}');
      checkStoreBearerToken('storeBearerToken owncube', '{"userAddress":"michiel@owncube.com","bearerToken":"db2e83efc029a92e037f4c68bc59cf73"}');
      checkWebsite('unhosted.org main page', 'unhosted.org', 'Unhosted: personal data freedom');
      checkWebsite('libredocs.org main page', 'libredocs.org', 'liberate your ideas');
      checkHostMeta('OwnCube host-meta', 'owncube.com', 'template');
      checkHostMeta('5apps host-meta', '5apps.com', 'https://5apps.com/webfinger?q={uri}');
    }, 60000);
  });
});
http.createServer(function(req, res) {
  res.writeHead(200, {});
  res.end('see #unhostedmonitor on freenode');
}).listen(80);
