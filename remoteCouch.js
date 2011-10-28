(function() {
  var http = require('http'),
    cradle = require('cradle'),
    fs = require('fs'),
    Buffer = require('buffer').Buffer,
    crypto = require('crypto'),
    shasum = crypto.createHash('sha1'),
    config = require('./config').config;

  Buffer.prototype.randomize = function() {
    var fd = fs.openSync('/dev/urandom', 'r');
    fs.readSync(fd, this, 0, this.length, 0);
    fs.closeSync(fd);
    return this;
  }
  function randStr(length) {
    var buffer = new Buffer(length);
    buffer.randomize();
    return buffer.toString('base64');
  }
  function genUser(userName) {
    console.log('Generating pwd');
    var pwd=randStr(40);
    console.log(pwd);
    console.log('Generating salt');
    var salt=randStr(40);
    console.log(salt);
    console.log('Generating sha');
    shasum.update(pwd+salt);
    var sha1 = shasum.digest('hex');
    console.log(sha1);
    var conn = new(cradle.Connection)(config.couch.host, config.couch.port, {
      cache: true, raw: false,
      auth: {username: config.couch.usr, password: config.couch.pwd}
    });
    conn.database('_users').save('org.couchdb.user:'+userName, {
      type: 'user',
      name: userName,
      roles: [],
      password_sha: sha1,
      salt: salt
    }, function (err, res) {
      console.log(JSON.stringify(err));
      console.log(JSON.stringify(res)); // True
    });
    return pwd;
  }
  function createScope(userName, dataScope) {
    var conn = new(cradle.Connection)(config.couch.host, config.couch.port, {
      cache: true, raw: false,
      auth: {username: config.couch.usr, password: config.couch.pwd}
    });
    var scopeDb = conn.database(dataScope);
    scopeDb.create();
    scopeDb.save('_security', {
      admins: {
        names: [userName]
      }
    }, function (err, res) {
      console.log(JSON.stringify(err));
      console.log(JSON.stringify(res)); // True
    });
    var pwd=genUser(userName);
    return pwd;
  }

  function createToken(userName, dataScope) {
    var password = createScope(userName, dataScope);
  
    //make basic auth header match bearer token for easy proxying:
    var bearerToken = (new Buffer(userName+':'+password)).toString('base64');
    return bearerToken;
  }

  function test() {
    var dataScope = 'documents';
    var userName = 'test@yourremotestorage.com';
    console.log(createToken(userName, dataScope));
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
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found\n');
      }
    }).listen(config.facade.port);
  }

  //test();
  serveFacade();

})();
