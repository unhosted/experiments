exports.handler = (function() {
  var url = require('url'),
    https = require('https'),
    querystring = require('querystring'),
    fs = require('fs'),
    userDb = require('../userDb').userDb,
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
    if((typeof(postData) != 'string') || (postData.length < 5)) {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({error:'please provide a ?q=.. query'}));
      return;
    }
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
            var storageInfo=JSON.parse(data).storageInfo;
            //upgrade hack:
            if(storageInfo.auth.indexOf('cors/auth/modal.html') != -1) {
              storageInfo.auth = 'http://proxy.unhosted.org/OAuth.html?user_address='+encodeURIComponent(postData);
            }
            if(storageInfo.template.indexOf('proxy.libredocs.org') != -1) {
              storageInfo.template = 'http://proxy.unhosted.org/CouchDB?'
                  +storageInfo.template.substring('http://proxy.libredocs.org/'.length);
            }
            res.end(JSON.stringify(storageInfo));
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
  function serveFile(res, filename, contentType) {
    fs.readFile(filename, 'binary', function(err, file) {
      if(err && err.code == 'EISDIR') {
        res.writeHead(301, {'Location': 'http://'+host+uripath+'/'});
        res.end('Location: http://'+host+uripath+'/\n');
      } else if(err) {
        console.log(err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err + '\n');
      } else {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': contentType
        });
        res.write(file, 'binary');
        res.end();
      }
    });
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
      // first services:
      //
      // 1 - password service for Iris Couch, and OAuth dialog
      // 2 - CouchDB proxy
      // 3 - fakefinger lookup
      var urlObj = url.parse(req.url, true);
      console.log(urlObj);
      if(urlObj.pathname=='/lookup') {
        serveLookup(req, res, urlObj.query['q']);
      } else if(urlObj.pathname=='/browserid2pwd') {
        serveIrisPwdService(req, res, dataStr, urlObj.query['subdomain']);
      } else {
        serveFile(res, '/Users/mich/Code/experiments/proxy-unhosted-org/static/file-'+urlObj.pathname.substring(1), 'text/html');
      }
    });
  }

  return {
    serve: serve
  };
})();
