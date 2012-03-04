var categoryCreator = (function() {
  function httpCall(couchAddress, user, pass, dbName, key, value, method, cb) {
    console.log('couchPut("'+couchAddress+'", "'+user+'", "'+pass+'", "'+dbName+'", "'+key+'", '+JSON.stringify(value)+', cb);');
    var xhr = new XMLHttpRequest();
    xhr.open(method, 'http://'+couchAddress+'/'+dbName+'/'+key, true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        cb(xhr.status, xhr.responseText);
      }
    };
    xhr.send(JSON.stringify(value));
  }
  function couchPut(couchAddress, user, pass, dbName, key, value, cb) {
    httpCall(couchAddress, user, pass, dbName, key, value, 'PUT', function(status, response) { 
      if(status == 200 || status == 201 || (status == 412 && response == '{"error":"file_exists","reason":"The database could not be created, the file already exists."}\n')) {
        cb();
      } else if(status == 409) {
        console.log('conflict; getting revision');
        httpCall(couchAddress, user, pass, dbName, key, value, 'GET', function(status2, response2) { 
          console.log('conflict; overwriting');
          try {
            value._rev = JSON.parse(response2)._rev;
            console.log(value);
          } catch(e) {
            console.log('could not re-revision');
            return;
          }
          httpCall(couchAddress, user, pass, dbName, key, value, 'PUT', function(status3) {
            if(status3 == 200 || status3 == 201) {
              console.log('rePUTting worked');
              cb();
            } else {
              console.log('rePUTting failed');
              cb();
            }
          });
        });
      } else {
        console.log('oops! got a '+status+' from CouchDB PUT');
        cb();
      }
    });
  }
  function genToken(clientId, password) {
    return Base64.encode(clientId+':'+password);
  }
  function randStr(length) {
    var buffer = '';
    while(buffer.length < length) {
      buffer += Math.random().toString(36).substring(2);
    }
    return buffer.substring(0, length);
  }
  function genUser(userName, pwd) {
    var salt=randStr(40);
    return {
      type: 'user',
      name: userName,
      roles: [],
      password_sha: SHA1(pwd+salt),
      salt: salt
    };
  }

  function createUser(couchAddress, masterUser, masterPass, newUser, newPass, cb) {
    var userObj = genUser(newUser, newPass);
    couchPut(couchAddress, masterUser, masterPass, '_users', 'org.couchdb.user:'+newUser, userObj, cb);
  }
  function createDatabase(couchAddress, masterUser, masterPass, dbName, userName, isPublic, cb) {
    console.log('database...');
    couchPut(couchAddress, masterUser, masterPass, dbName, '', '', function() {
      var sec;
      if(isPublic) {
        sec = {
          admins: {names:[userName]}
        };
      } else {
        sec = {
          admins: {names:[userName]},
          readers: {names:[userName]}
        };
      }
      console.log('security object...');
      couchPut(couchAddress, masterUser, masterPass, dbName, '_security', sec, cb);
    });
  }
  function createNextCategory(couchAddress, couchUsr, couchPwd, categories, i, clientId, pwd, cb) {
    if(i==categories.length) {
      console.log('done creating '+i+' categories');
      cb();
    } else {
      console.log('creating category '+i+': "'+categories[i]);
      createDatabase(couchAddress, couchUsr, couchPwd, categories[i], clientId, (categories[i] == 'public'), function() {
        createNextCategory(couchAddress, couchUsr, couchPwd, categories, i+1, clientId, pwd, cb);
      });
    }
  }
  return function(couchHost, couchUsr, couchPwd, categories, clientId, cb) {
    var pwd = randStr(40);
    var proxy = 'http://proxy.unhosted.org/CouchDB/'+'http://proxy.unhosted.org/CouchDB/';
    createUser(proxy+couchHost, couchUsr, couchPwd, clientId, pwd, function() {
      console.log('user created, now creating categories:');
      createNextCategory(proxy+couchHost, couchUsr, couchPwd, categories, 0, clientId, pwd, cb);
    });
  };
})();
