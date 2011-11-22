(function() {
  var http = require('http'),
    cradle = require('cradle'),
    fs = require('fs'),
    Buffer = require('buffer').Buffer,
    crypto = require('crypto'),
    url = require('url'),
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
    return buffer.toString('base64');
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
  function createScope(userName, password, clientId, dataScope, public, cb) {
    console.log('connecting to host '+userName+'.'+config.couch.parentDomain);
    var conn = new(cradle.Connection)(userName+'.'+config.couch.parentDomain, config.couch.port, {
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

  function createToken(userName, password, clientId, dataScope, cb) {
    var public = (dataScope == 'public');
    createScope(userName, password, clientId, dataScope, public, function(password) {
      //make basic auth header match bearer token for easy proxying:
      var bearerToken = (new Buffer(clientId+':'+password)).toString('base64');
      console.log(bearerToken+' <= '+clientId+':'+password);
      cb(bearerToken);
    });
  }

  function serveFacade() {
    http.createServer(function (req, res) {
      if(req.url=='/.well-known/host-meta') {
        res.writeHead(200, {
          'Content-Type': 'xrd+xml',
          'Access-Control-Allow-Origin': '*'});
        res.end('<?xml version="1.0" encoding="UTF-8"?>\n'
          +'<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0" xmlns:hm="http://host-meta.net/xrd/1.0">\n'
	  +'  <hm:Host xmlns="http://host-meta.net/xrd/1.0">'+config.facadeHost+'</hm:Host>\n'
          +'  <Link rel="lrdd" template="http://'+config.facadeHost+'/webfinger?q={uri}">\n'
          +'  </Link>\n'
          +'</XRD>\n');
      } else if(req.url.substring(0, '/webfinger'.length)=='/webfinger') {
        res.writeHead(200, {
          'Content-Type': 'xrd+xml',
          'Access-Control-Allow-Origin': '*'});
        res.end('<?xml version="1.0" encoding="UTF-8"?>\n'
          +'<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0" xmlns:hm="http://host-meta.net/xrd/1.0">\n'
	  +'  <hm:Host xmlns="http://host-meta.net/xrd/1.0">'+config.facadeHost+'</hm:Host>\n'
	  //+'  <Link rel="http://w3.org/ns/remoteStorage"\n'
	  +'  <Link rel="remoteStorage"\n'
          +'    template="http://'+config.proxyHost+'/{category}/"\n'
          +'    auth="http://'+config.facadeHost+'/auth"\n'
          +'    api="CouchDB"\n'
	  +'  ></Link>\n'
          +'</XRD>\n');
      } else if(req.url.substring(0, '/auth'.length)=='/auth') {
        var urlObj = url.parse(req.url, true);
        console.log(urlObj);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><form method="GET" action="/doAuth">\n'
          +'  Your '+config.couch.parentDomain+' user: <input name="userName" value="'+urlObj.query.userName+'"><br>\n'
          //+'  Your password:<input name="password" type="password" value="unhosted"><br>\n'
          +'  Your password:<input name="password" type="password" value=""><br>\n'
          +'  <input type="hidden" name="redirect_uri" value="'+urlObj.query.redirect_uri+'"><br>\n'
          +'  <input type="hidden" name="scope" value="'+urlObj.query.scope+'"><br>\n'
          +'  <input type="submit" value="Allow this app to read and write on your couch"><br>\n'
          +'  <a target="_blank" href="http://github.com/unhosted/experiments/">If you have your own server or domain, host this proxy yourself!</a><br>\n'
          +'</form></html>\n');
      } else if(req.url.substring(0, '/doAuth'.length)=='/doAuth') {
        var urlObj = url.parse(req.url, true);
        console.log(urlObj);
        var clientId = '';//don't trust the clientId that the RP claims - instead, derive it from redirect_uri:
        for(var i in urlObj.query.redirect_uri) {
          var thisChar = urlObj.query.redirect_uri[i];
          if((thisChar >= 'a' && thisChar <= 'z') || (thisChar >= 'A' && thisChar <= 'Z')) {
            clientId += thisChar;
          } else {
            clientId += thisChar;
          }
        }
        console.log('Parsed redirect_uri to form clientId:'+clientId);
        createToken(urlObj.query.userName, urlObj.query.password, clientId, urlObj.query.scope, function(token) {
          res.writeHead(302, {Location: urlObj.query.redirect_uri+'#access_token='+encodeURIComponent(token)});
          res.end('Found');
        });
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found\n');
      }
    }).listen(config.backends.facade);
    console.log('listening on '+config.backends.facade);
  }

  //test();
  serveFacade();

})();
