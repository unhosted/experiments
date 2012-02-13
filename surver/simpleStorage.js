exports.simpleStorage = (function() {
  var url = require('url'),
    config = require('./config').config,
    redis = require('redis'),
    redisClient;
  
  function initRedis(cb) {
    redisClient = redis.createClient(config.port, config.host);
    redisClient.on("error", function (err) {
      console.log("error event - " + redisClient.host + ":" + redisClient.port + " - " + err);
    });
    redisClient.auth(config.pwd, function() {
       cb();
    });
  }
  function doReq(reqObj, cb) {//opens and closes redis
    initRedis(function(){
      checkToken(reqObj.userId, reqObj.token, reqObj.category, function(result) {
        if(result) {
          if(reqObj.method=='GET') {
            redisClient.get('value:'+reqObj.userId+':'+reqObj.category+':'+reqObj.key, function(err, value) {
              console.log('redis says:');console.log(err);console.log(value);
              redisClient.quit();
              cb(200, value);
            });
          } else if(reqObj.method=='PUT') {
            redisClient.set('value:'+reqObj.userId+':'+reqObj.category+':'+reqObj.key, reqObj.value, function(err, data) {
              console.log('redis says:');console.log(err);console.log(data);
              redisClient.quit();
              cb(200);
            });
          } else if(reqObj.method=='DELETE') {
            redisClient.del('value:'+reqObj.userId+':'+reqObj.category+':'+reqObj.key, function(err, data) {
              console.log('redis says:');console.log(err);console.log(data);
              redisClient.quit();
              cb(200);
            });
          }
        } else {
          redisClient.quit();
          cb(403);
        }
      });
    });
  }
  function serve(req, res) {
    var responseHeaders = {
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Methods': 'POST, PUT, GET',
      'Access-Control-Allow-Headers': 'Origin, Content-Type'
    };
    if(req.method=='OPTIONS') {
      res.writeHead(200, responseHeaders);
      res.end();
    } else {
      var reqObj={};
      try {
        var urlObj = url.parse(req.url);
        var pathNameParts = urlObj.pathname.split('/');
        reqObj = {
          method: req.method,
          token: req.headers.authorization.substring('Bearer '.length),
          userId: pathNameParts[1],
          category: pathNameParts[2],
          key: pathNameParts[3],
          value: ''
        };
        console.log(reqObj);
        req.on('data', function(chunk) {
          reqObj.value += chunk;
          console.log('DATA:'+chunk);
        });
        req.on('end', function() {
          console.log('END:');
          doReq(reqObj, function(code, data) {
            res.writeHead(code, responseHeaders);
            res.end(data);
          });
        });
      } catch(e) {
          res.writeHead(500, responseHeaders);
          res.end();
          console.log(e);
      }
    }
  }
  function checkToken(userId, token, category, cb) {//assumes redis is and stays open
    redisClient.get('token:'+userId+':'+token, function(err, categories) {
      if(categories == category) {
        cb(true);
      } else {
        cb(false);
      }
    });
  }
  function addToken(userId, token, categories, cb) {//opens and closes redis
    initRedis(function(){
      redisClient.set('token:'+userId+':'+token, categories, function(err, data) {
        redisClient.quit();
        cb();
      });
    });
  }
  function removeToken(userId, token, cb) {//opens and closes redis
    initRedis(function(){
      redisClient.del('token:'+userId+':'+token, function(err, data) {
        redisClient.quit();
        cb();
      });
    });
  }
  function addUser(userId, password, cb) {//opens and closes redis
    initRedis(function(){
      redisClient.set('user:'+userId, password, function(err, data) {
        redisClient.quit();
        cb();
      });
    });
  }
  function createToken(userId, password, token, categories, cb) {//opens and closes redis
    initRedis(function(){
      redisClient.get('user:'+userId, function(err, data) {
        if(data == password) {
          redisClient.set('token:'+userId+':'+token, categories, function(err, data) {
            redisClient.quit();
            cb(true);
          });
        } else {
          cb(false);
        }
      });
    });
  }

  return {
    serve: serve,
    addToken: addToken,
    removeToken: removeToken,
    addUser: addUser,
    createToken: createToken
  };
})();
