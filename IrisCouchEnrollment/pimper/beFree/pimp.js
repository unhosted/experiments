var pimper = (function() {
  var couchAddress, adminUsr, adminPwd, adminProxy;//using module globals here to limit func args
  var content = {};
  function httpPut(address, value, withCredentials, attachment, contentType) {
    var host;
    if(withCredentials) {
      host = 'http://'+adminUsr+':'+adminPwd+'@'+adminProxy+address;
    } else {
      host = 'http://'+adminProxy+address;
    }
    if(window) {//in the browser
      var xhr = new XMLHttpRequest();
      console.log('PUTting to '+host);
      xhr.open('PUT', host, false);
      if(contentType) {
        xhr.setRequestHeader('Content-Type: '+contentType);
      }
      if(value) {
        xhr.send(value);
      } else if(attachment) {
        xhr.send(content[attachment]);
      } else {
        send();
      }
    } else {
      var options=' -X PUT';
      if(value) {
        options += " -d'"+value+"'";
      }
      if(attachment) {
        options += ' --data-binary @'+attachment;
      }
      if(contentType) {
        options += ' -H "Content-Type: '+contentType+'"';
      }
      console.log('echo curl '+options+' '+host); 
      console.log('curl '+options+' '+host); 
    }
  }
  function createAdminUser(putHost, adminUsr, adminPwd, proxy) {
    httpPut(putHost+'/_config/admins/'+adminUsr, '\"'+adminPwd+'\"');
  }
  function createDatabase(dbName) {
    httpPut(couchAddress+'/'+dbName, null, true);
  }
  function createDocument(dbName, docName, value) {
    httpPut(couchAddress+'/'+dbName+'/'+docName, value, true);
  }
  function uploadAttachment(dbName, docName, attachmentName, localFileName, contentType) {
    httpPut(couchAddress+'/'+dbName+'/'+docName+'/'+attachmentName, null, true, localFileName, contentType);
  }
  function pimp(couchAddress, adminUsr, adminPwd, proxy, cb) {
    var httpTemplate;
    if(proxy) {
      adminProxy = proxy;
      httpTemplate = 'http://'+proxy+couchAddress+'/{category}/';
    } else {
      httpTemplate = 'http://'+couchAddress+'/{category}/_design/remoteStorage/_show/cors/';
    }
    var putHost = 'http://'+proxy+couchAddress+':5984';
    createAdminUser(putHost, adminUsr, adminPwd);
    createDatabase('cors');
    createDocument('cors', '_design/well-known', '{'+
      '\"_id\": \"_design/well-known\",'+
      '\"shows\": {'+
        '\"host-meta\":'+ 
          '\"function\(doc, req\) { return {'+
            ' \\"body\\": \\"'+
            '<?xml version=\\\\\\"1.0\\\\\\" encoding=\\\\\\"UTF-8\\\\\\"?>\\\\\\n'+
            '<XRD xmlns=\\\\\\"http://docs.oasis-open.org/ns/xri/xrd-1.0\\\\\\" xmlns:hm=\\\\\\"http://host-meta.net/xrd/1.0\\\\\\">\\\\\\n'+
            '  <hm:Host xmlns=\\\\\\"http://host-meta.net/xrd/1.0\\\\\\">'+couchAddress+'</hm:Host>\\\\\\n'+
            '  <Link rel=\\\\\\"lrdd\\\\\\" template=\\\\\\"http://'+couchAddress+'/cors/_design/well-known/_show/webfinger?q={uri}\\\\\\"></Link>\\\\\\n'+
            '</XRD>\\\\\\n\\",'+
            '\\"headers\\": {\\"Access-Control-Allow-Origin\\": \\"*\\", \\"Content-Type\\": \\"application/xml+xrd\\"}'+
          '};}\",'+
        '\"webfinger\":'+ 
          '\"function\(doc, req\) { return {'+
            ' \\"body\\": \\"'+
            '<?xml version=\\\\\\"1.0\\\\\\" encoding=\\\\\\"UTF-8\\\\\\"?>\\\\\\n'+
            '<XRD xmlns=\\\\\\"http://docs.oasis-open.org/ns/xri/xrd-1.0\\\\\\" xmlns:hm=\\\\\\"http://host-meta.net/xrd/1.0\\\\\\">\\\\\\n'+
            '  <hm:Host xmlns=\\\\\\"http://host-meta.net/xrd/1.0\\\\\\">'+couchAddress+'</hm:Host>\\\\\\n'+
            '  <Link \\\\\\n'+
            '    rel=\\\\\\"remoteStorage\\\\\\"\\\\\\n'+
            '    api=\\\\\\"CouchDB\\\\\\"\\\\\\n'+
            '    auth=\\\\\\"http://'+couchAddress+'/cors/auth/modal.html\\\\\\"\\\\\\n'+
            '    template=\\\\\\"'+httpTemplate+'\\\\\\"\\\\\\n'+
            '  ></Link>\\\\\\n'+
            '</XRD>\\\\\\n\\",'+
            '\\"headers\\": {\\"Access-Control-Allow-Origin\\": \\"*\\", \\"Content-Type\\": \\"application/xml+xrd\\"}'+
          '};}\",'+
        '\"vep\":'+
          '\" function\(doc, req\) { return { \\"body\\": \\"\(coming soon\)\\",'+
          ' \\"headers\\": {\\"Access-Control-Allow-Origin\\": \\"*\\"}'+
         '};}\"'+
         '}}');
    uploadAttachment('cors', 'auth', 'modal.html', 'files/modal.html', 'text/html');
    uploadAttachment('cors', 'base64', 'base64.js', 'files/base64.js', 'application/javascript');
    uploadAttachment('cors', 'sha1', 'sha1.js', 'files/sha1.js', 'application/javascript');
  }
  function provision(userName, firstName, lastName, cb) {
    navigator.id.get(function(assertion) {
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', '/provision', true);
      xhr.onreadystatechange= function() {
        if(xhr.readyState == 4) {
          if(xhr.status == 201) {
            cb('ok');
          } else if(xhr.status == 409) {
            cb('taken');
          } else {
            cb(xhr.status);
          }
        }
      };
      var data = JSON.stringify({
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        browserIdAudience: 'http://libredocs.org',
        browserIdAssertion: assertion
      });
      xhr.send(data);
    });
  }
  function ping(userName, proxy, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://'+proxy+userName+'.iriscouch.com', true);
    xhr.onreadystatechange= function() {
      if(xhr.readyState == 4) {
        if(xhr.status == 200) {
          cb('ok');
        } else if(xhr.status == 404) {
          cb('no');
        } else {
          cb(xhr.status);
        }
      }
    };
    xhr.send();
  }

  return {
    pimp: pimp,
    ping: ping,
    provision: provision
  };
})();

var options;
if(window) {
  //we're in the browser
} else if(process && process.argv && process.argv.length >= 5 ) {
  options = process.argv.splice(2);
  pimper.pimp(options[0], options[1], options[2]);
} else if(process.argv) {
  console.log('use as: node pimp.js {user}@{domain} {password} {yourremotestorage.net/CouchDB/proxy/}');
  console.log('E.g.: node pimp.js me@michiel.iriscouch.com asdf yourremotestorage.net/CouchDB/proxy/');
}
