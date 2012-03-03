exports.handler = (function() {
  var url = require('url'),
    https = require('https'),
    querystring = require('querystring'),
    fs = require('fs'),
    userDb = require('./config').config,
    hardcode = require('./hardcode').hardcode,
    redis = require('redis'),
    url = require('url'),
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
  function serveLookup(req, res, postData) {
    if(postData.substring(0, 5)=='acct:') {
      postData = postData.substring(5);
    }
    console.log('looking up '+postData);
    var hardcoded = hardcode(postData);
    if(hardcoded) {
      console.log('hardcoded');
      console.log(hardcoded);
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(hardcoded));
    } else {
      console.log('serveGet');
      console.log(postData);
      initRedis();
      redisClient.get(postData, function(err, data) {
        console.log('this came from redis:');
        console.log(err);
        console.log(data);
        if(data) {
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*'
          });
          try {
            res.end(JSON.stringify(JSON.parse(data).storageInfo));
          } catch (e) {
            res.end('undefined');
          }
        } else {
          res.writeHead(404, {
            'Access-Control-Allow-Origin': '*'
          });
          res.end('null');
        }
      });
      console.log('outside redisClient.get');
      redisClient.quit();
    }
  }
  function serveApp(req, res) {
    res.writeHead(200);
    res.end('app');
  }
  function serve(req, res, baseDir) {
    console.log('serve');
    var dataStr = '';
    req.on('data', function(chunk) {
      dataStr += chunk;
    });
    req.on('end', function() {
      // / GET: user interface
      // /couch/domain/: couch proxy, only to couch port
      // /dropbox/username/: dropbox proxy, requires BrowserID OAuth:wQ
      // / POST: get info
      var urlObj = url.parse(req.url, true);
      console.log(urlObj);
      if(urlObj.pathname=='/lookup') {
        serveLookup(req, res, urlObj.query['q']);
      } else {
        serveApp(req, res, dataStr);
      }
    });
  }

  return {
    serve: serve
  };
})();
