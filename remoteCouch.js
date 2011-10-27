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
  }
  genUser('test');
})();
