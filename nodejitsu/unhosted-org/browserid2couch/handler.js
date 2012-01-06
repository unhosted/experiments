//when we get here, the user's couch has already been pimped
//so each user gets a control panel with
//- a pimper (just give the per-user couch url, and it will create an admin user, add into webfinger
//- web intents registration
//- cors proxy
//- oauth dialog
//- browserid2couch

exports.handler = (function() {
  var http = require('http'),
    cradle = require('cradle'),
    fs = require('fs'),
    Buffer = require('buffer').Buffer,
    crypto = require('crypto'),
    url = require('url'),
    querystring = require('querystring'),
    browseridVerify = require('browserid-verifier'),
    config = require('./config').config;

  Buffer.prototype.randomize = function() {
    var fd = fs.openSync('/dev/urandom', 'r');
    fs.readSync(fd, this, 0, this.length, 0);
    fs.closeSync(fd);
    return this;
  }
  function str2sha(str) {
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
  } 
  function randStr(length) {
    var buffer = new Buffer(length);
    buffer.randomize();
    return buffer.toString('base64').replace(/\//g, '-');//forward slashed in passwords don't play nice with curl
  }
  function genUser(clientId, conn, cb) {
    console.log('Generating pwd');
    var pwd=randStr(40);
    console.log(pwd);
    console.log('Generating salt');
    var salt=randStr(40);
    console.log(salt);
    console.log('Generating sha');
    var sha1 = str2sha(pwd+salt);
    console.log(sha1);
    console.log('will now add CouchDB user "'+clientId+'"');
    conn.database('_users').save('org.couchdb.user:'+clientId, {
      type: 'user',
      name: clientId,
      roles: [],
      password_sha: sha1,
      salt: salt
    }, function (err, res) {
      console.log('err of adding user:');
      console.log(err);
      console.log('res of adding user:');
      console.log(res); // True
      cb(pwd);
    });
  }
  function createScope(userName, password, ourUser, clientId, dataScope, public, cb) {
    console.log('connecting to host '+config.ourUser.couchUrl);
    var conn = new(cradle.Connection)(config.ourUser.couchUrl, config.ourUser.couchPort, {
      cache: true, raw: false,
      auth: {username: userName, password: password}
    });
    var dbName, sec;
    if(public) {
      dbName = dataScope.replace('.', '_');
      sec= {admins:{names:[clientId]}};//leaving readers undefined
    } else {
      dbName = dataScope.replace('.', '_');
      sec= {admins:{names:[clientId]}, readers:{names:[clientId]}};
    }
    var scopeDb = conn.database(dbName);
    scopeDb.exists(function(err, exists) {
      console.log('looking for '+dbName+':');
      console.log(err);
      console.log(exists);
      if(err) {
        console.log('error looking for scopeDb:"'+dbName+'"');
        console.log(err);
      } else if(exists) {
        console.log('database "'+dbName+'" exists already!');
      } else {
      	console.log('creating database "'+dbName+'"');
        scopeDb.create();//looking at https://github.com/cloudhead/cradle this seems to be a synchronous call?
        console.log('created database "'+dbName+'"');
      }
      
      console.log('adding users to database "'+dbName+'":');
      console.log(sec);
      scopeDb.save('_security', sec, function (err, res) {
        console.log('result of saving security doc:');
        console.log(sec);
        console.log('err:');
        console.log(err);
        console.log('res:');
        console.log(res);
        if(err) {
          console.log('there was an error');
        } else {
          console.log('db and security doc created, will now generate user:');
          genUser(clientId, conn, cb);
        }
      });
    });
  }

  function createToken(userName, password, ourUser, clientId, dataScope, cb) {
    var public = (dataScope == 'public');
    createScope(userName, password, ourUser, clientId, dataScope, public, function(password) {
      //make basic auth header match bearer token for easy proxying:
      var bearerToken = (new Buffer(clientId+':'+password)).toString('base64');
      console.log(bearerToken+' <= '+clientId+':'+password);
      cb(bearerToken);
    });
  }

  function getBearerToken(audience, ourUser, cb) {
    var dbName = '';//don't trust the clientId that the RP claims - instead, derive it from redirect_uri:
    for(var i in audience) {
      var thisChar = audience[i];
      if((thisChar >= 'a' && thisChar <= 'z') || (thisChar >= 'A' && thisChar <= 'Z') || (thisChar >= '0' && thisChar <= '9')) {
        dbName += thisChar;
      } else {
        dbName += '_';//thisChar;
      }
    }
    console.log('Parsed audience to form dbName:'+dbName);
    var userName = dbName;
    createToken(config.ourUser.couchUsr, config.ourUser.couchPwd, ourUser, userName, dbName, cb);
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
          var userAddressParts = r.email.split('@').
          if(userAddressParts[1] == 'unhosted.org') {
            getBearerToken(postData.audience, userAddressParts[0], function(token) {
              console.log('token, allowing origin '+req.headers.origin);
              console.log(req.headers);
              console.log('handing out token:');
              console.log(token);
              res.writeHead(200, {'Content-type': 'application/json', 'Access-Control-Allow-Origin': req.headers.origin});
              res.write('{"token":"'+token+'"}');
              res.end();
            });
          } else {
            console.log('nope, allowing origin '+req.headers.origin);
            console.log(req.headers);
            res.writeHead(200, {'Content-type': 'application/json', 'Access-Control-Allow-Origin': req.headers.origin});
            res.write('nope');
            res.end();
          }
        }
      });
    });
  }

  return {
    serve: serve
  };
})();
