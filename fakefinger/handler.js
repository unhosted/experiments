exports.handler = (function() {
  var url = require('url'),
    https = require('https'),
    querystring = require('querystring'),
    fs = require('fs'),
    userDb = require('./config').config,
    redis = require('redis'),
    redisClient;
  
  function initRedis(cb) {
    console.log('initing redis');
    redisClient = redis.createClient(userDb.port, userDb.host);
    redisClient.on("error", function (err) {
      console.log("error event - " + redisClient.host + ":" + redisClient.port + " - " + err);
    });
    redisClient.auth(userDb.pwd, function() {
       console.log('redis auth done');
       if(cb) cb();
    });
  }
  function serveGet(req, res, postData) {
    console.log('serveGet');
    console.log(postData);
    initRedis();
    redisClient.get(postData, function(err, data) {
      console.log('this came from redis:');
      console.log(err);
      console.log(data);
      if(data) {
        res.writeHead(200);
        try {
          res.end(JSON.stringify(JSON.parse(data).storageInfo));
        } catch (e) {
          res.end('undefined');
        }
      } else {
        res.writeHead(404);
        res.end('null');
      }
    });
    console.log('outside redisClient.get');
    redisClient.quit();
  }

  function serve(req, res, baseDir) {
    console.log('serve');
    var dataStr = '';
    req.on('data', function(chunk) {
      dataStr += chunk;
    });
    req.on('end', function() {
      serveGet(req, res, dataStr);
    });
  }

  return {
    serve: serve
  };
})();
