exports.handler = (function() {
  var url = require('url'),
    querystring = require('querystring'),
    browseridVerify = require('browserid-verifier'),
    couchConfig = require('./config').config;

  function couchPut(dbName, key, value) {
    console.log('couchPut("'+dbName+'", "'+key+'", "'+value+'");');
  }
  function getBearerToken(userName, dbName, cb) {
    var userPass = 'asdf';
    var userObj = {
      name: userName,
      password_sha1: 'qwer'
    }
    couchPut('_users', 'org.couchdb.user::'+userName, userObj);
    couchPut(dbName, '', '');
    var token = 'base64';//(userName.':'.userPass);
    cb(token);
  }
  function serve(req, res, baseDir) {
    console.log('serving browserid2couch');
    var dataStr = '';
    req.on('data', function(chunk) {
      dataStr += chunk;
    });
    req.on('end', function() {
      postData = querystring.parse(dataStr);
      //if(!postData.audience) {
      //  postData.audience = 'http://myfavouritesandwich.org';
      //}
      browseridVerify(postData, function(err, r) {
        if(err) {
          console.log('err, allowing origin '+req.headers.origin);
          console.log(req.headers);
          res.writeHead(200, {'Content-type': 'application/json', 'Access-Control-Allow-Origin': req.headers.origin});
          res.write(JSON.stringify(err));
          res.end();
        } else {
          if(r.email == 'michiel@unhosted.org') {
            getBearerToken(postData.audience, postData.audience, function(token) {
              console.log('token, allowing origin '+req.headers.origin);
              console.log(req.headers);
              res.writeHead(200, {'Content-type': 'application/json', 'Access-Control-Allow-Origin': req.headers.origin});
              res.write(token);
            });
          } else {
            console.log('nope, allowing origin '+req.headers.origin);
            console.log(req.headers);
            res.writeHead(200, {'Content-type': 'application/json', 'Access-Control-Allow-Origin': req.headers.origin});
            res.write('nope');
          }
          res.end();
        }
      });
    });
  }

  return {
    serve: serve
  };
})();
