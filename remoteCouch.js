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
  function genUser(userAddress, cb) {
    console.log('Generating pwd');
    var pwd=randStr(40);
    console.log(pwd);
    console.log('Generating salt');
    var salt=randStr(40);
    console.log(salt);
    console.log('Generating sha');
    var sha1 = str2sha(pwd+salt);
    console.log(sha1);
    var conn = new(cradle.Connection)(config.couch.host, config.couch.port, {
      cache: true, raw: false,
      auth: {username: config.couch.usr, password: config.couch.pwd}
    });
    conn.database('_users').save('org.couchdb.user:'+userAddress, {
      type: 'user',
      name: userAddress,
      roles: [],
      password_sha: sha1,
      salt: salt
    }, function (err, res) {
      console.log(JSON.stringify(err));
      console.log(JSON.stringify(res)); // True
      cb(pwd);
    });
  }
  function createScope(userAddress, dataScope, public, cb) {
    var conn = new(cradle.Connection)(config.couch.host, config.couch.port, {
      cache: true, raw: false,
      auth: {username: config.couch.usr, password: config.couch.pwd}
    });
    var scopeDb = conn.database(dataScope);
    scopeDb.create();//looking at https://github.com/cloudhead/cradle this seems to be a synchronous call?
    var sec;
    if(public) {
      sec= {admins:{names:[userAddress]}};//leaving readers undefined
    } else {
      sec= {admins:{names:[userAddress]}, readers:{names:[userAddress]}};
    }
    scopeDb.save('_security', sec, function (err, res) {
      console.log(JSON.stringify(err));
      console.log(JSON.stringify(res)); // True
      genUser(userAddress, cb);
    });
  }

  function createToken(userAddress, dataScope, public, cb) {
    createScope(userAddress, dataScope, public, function(password) {
      //make basic auth header match bearer token for easy proxying:
      var bearerToken = (new Buffer(userAddress+':'+password)).toString('base64');
      cb(bearerToken);
    });
  }

  function serveFacade() {
    http.createServer(function (req, res) {
      if(req.url=='/.well-known/host-meta') {
        res.writeHead(200, {'Content-Type': 'xrd+xml'});
        res.end('<?xml version="1.0" encoding="UTF-8"?>\n'
          +'  <Link rel="lrdd" template="http://'+config.facade.host+':'+config.facade.port+'/webfinger?q={uri}">\n'
          +'  </Link>\n'
          +'</XRD>\n');
      } else if(req.url=='/webfinger') {
        res.writeHead(200, {'Content-Type': 'xrd+xml'});
        res.end('<?xml version="1.0" encoding="UTF-8"?>\n'
          +'<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0" xmlns:hm="http://host-meta.net/xrd/1.0">\n'
	  +'  <hm:Host xmlns="http://host-meta.net/xrd/1.0">yourremotestorage.com</hm:Host>\n'
	  +'  <Link rel="http://w3.org/ns/remoteStorage"\n'
          +'    template="http://'+config.proxy.host+':'+config.proxy.port+'/{scope}_private/"\n'
          +'    auth="http//'+config.facade.host+':'+config.facade.port+'/auth_private"\n'
          +'    api="CouchDb/private"\n'
	  +'  <Link rel="http://w3.org/ns/remoteStorage"\n'
          +'    template="http://'+config.proxy.host+':'+config.proxy.port+'/{scope}_public/"\n'
          +'    auth="http//'+config.facade.host+':'+config.facade.port+'/auth_public"\n'
          +'    api="CouchDb/public"\n'
	  +'  ></Link>\n'
          +'</XRD>\n');
      } else if(req.url=='/auth_private') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><form method="GET" action="/doAuth">\n'
          +'  Your user address: <input name="userAddress" value="test@yourremotestorage.com"><br>\n'
          +'  Your password:<input name="password" type="password" value="unhosted"><br>\n'
          +'  <input type="hidden" name="public" value="false"><br>\n'
          +'  <input type="submit" value="Allow this app to read and write on your private couch">\n'
          +'</form></html>\n');
      } else if(req.url=='/auth_public') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><form method="GET" action="/doAuth">\n'
          +'  Your user address: <input name="userAddress" value="test@yourremotestorage.com"><br>\n'
          +'  Your password:<input name="password" type="password" value="unhosted"><br>\n'
          +'  <input type="hidden" name="public" value="true"><br>\n'
          +'  <input type="submit" value="Allow this app to read and write on your private couch">\n'
          +'</form></html>\n');
      } else if(req.url.substring(0, '/doAuth'.length)=='/doAuth') {
        var urlObj = url.parse(req.url, true);
        console.log(urlObj);
        
        var dataScope = urlObj.query.scope;
        var dataScop = urlObj.query.scope;
        var userAddress = urlObj.query.userAddress;
        if(config.passwords[userAddress] == str2sha(urlObj.query.password)) {
          createToken(urlObj.query.userAddress, urlObj.query.scope, (urlObj.query.public=='true'), function(token) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('<html><h3>Location: '+urlObj.query.redirect_url+'#access_token='+token+'</h3></html>\n');
          });
        } else {
          res.writeHead(401, {'Content-Type': 'text/html'});
          res.end('<html><h3>Please set passwords[\''+userAddress+'\'] to \''
            +str2sha(urlObj.query.password)
            +'\' in config.js to make that password work\n'
            +'</h3></html>');
        }
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found\n');
      }
    }).listen(config.facade.port);
  }

  //test();
  serveFacade();

})();
