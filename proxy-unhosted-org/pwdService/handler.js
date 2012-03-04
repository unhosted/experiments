exports.handler = (function() {
  var https = require('https'),
    userDb = require('../userDb').userDb,
    redis = require('redis');
  function browseridVerify(audience, assertion, cb) {
    var queryStr = 'audience='+encodeURIComponent(audience)+'&assertion='+encodeURIComponent(assertion);
    console.log(queryStr);
    var options = {
      host: 'browserid.org',
      port: 443,
      path: '/verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': queryStr.length
      }
    };
    var request = https.request(options, function(response) {
      var dataStr='';
      response.on('data', function(chunk) {
        dataStr += chunk;
      });
      response.on('end', function() {
        console.log(dataStr);
        var r = JSON.parse(dataStr);
        cb((r.status=='okay'?r.email:false));
      });
    });
    request.write(queryStr);
    request.end();
  }
  function fetchObj(userAddress, cb) {
    var redisClient = redis.createClient(userDb.port, userDb.host);
    redisClient.on("error", function (err) {
      console.log("error event - " + redisClient.host + ":" + redisClient.port + " - " + err);
    });
    redisClient.auth(userDb.pwd, function() {
      console.log('redis auth done');
      redisClient.get(userAddress, function(err, data) {
        if(err) {
          cb(null);
        } else {
          try {
            cb(JSON.parse(data));
          } catch(e) {
            cb(null);
          }
        }
      });
    });
  }
  function serveLookup(req, res, postData) {

  }
  function serve(req, res, baseDir) {
    var dataStr='';
    req.on('data', function(chunk) {
      dataStr+=chunk;
    });
    req.on('end', function() {
      browseridVerify('http://proxy.unhosted.org', dataStr, function(userAddress) {
        if(userAddress) {
          fetchObj(userAddress, function(obj) {
            if(obj) {
              var credentials = {
                host: obj.couchHost,
                usr: 'org.couchdb.user:'+userAddress,
                pwd: obj.adminPwd
              }
              res.writeHead(200);
              res.end(JSON.stringify(credentials));
            } else {
              res.writeHead(404);
              res.end();
            }
          });
        } else {
          res.writeHead(403);
          res.end();
        }
      });
    });
  }

  return {
    serve: serve
  };
})();
