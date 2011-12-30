var pimper = (function() {
  var content = {};
  function httpPut(address, value, auth, attachment, contentType) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', address, false);
    if(auth) {
      xhr.withCredentials=true;
      //xhr.setRequestHeader('Authorization', 'Bearer '+Base64.encode(auth.usr+':'+auth.pwd));//HACK: our proxy expects a bearer token, not a basic token
      xhr.setRequestHeader('Authorization', 'Basic '+Base64.encode(auth.usr+':'+auth.pwd));
    }
    if(value) {
      xhr.send(value);
    } else {
      xhr.send();
    }
  }
  function createAdminUser(hostToSquat, adminUsr, adminPwd, assertion) {
    httpPut('http://libredocs.org/squat', JSON.stringify({
      host: hostToSquat,
      usr: adminUsr,
      pwd: adminPwd,
      browserIdAssertion: assertion
    }));
  }
  function createDatabase(hostToSquat, dbName, assertion, authStr) {
    httpPut('http://libredocs.org/createDb', JSON.stringify({
      host: hostToSquat,
      dbName: dbName,
      browserIdAssertion: assertion
    }), authStr);
  }
  function createDocument(couchAddress, dbName, docName, authStr, value) {
    httpPut(couchAddress+'/'+dbName+'/'+docName, value, authStr);
  }
  function uploadAttachment(couchAddress, dbName, docName, authStr, attachmentName, localFileName, contentType) {
    httpPut(couchAddress+'/'+dbName+'/'+docName+'/'+attachmentName, null, authStr, localFileName, contentType);
  }
  function squat(couchAddress, adminUsr, adminPwd, assertion, cb) {
    createAdminUser(couchAddress, adminUsr, adminPwd, assertion);
    cb();
  }
  function populate(couchAddress, adminUsr, adminPwd, assertion, proxy, cb) {
    var httpTemplate = 'http://'+proxy+couchAddress+'/{category}/';
    var putHost = 'http://'+proxy+couchAddress;
    var authStr = {
      usr:adminUsr,
      pwd:adminPwd
    };
    createDatabase(couchAddress, 'cors', assertion, authStr);
    createDocument(putHost, 'cors', '_design/well-known', authStr, '{'+
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
    uploadAttachment(putHost, 'cors', 'auth', authStr, 'modal.html', 'files/modal.html', 'text/html');
    uploadAttachment(putHost, 'cors', 'base64', authStr, 'base64.js', 'files/base64.js', 'application/javascript');
    uploadAttachment(putHost, 'cors', 'sha1', authStr, 'sha1.js', 'files/sha1.js', 'application/javascript');
  }
  function provision(userName, firstName, lastName, assertion, cb) {
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
    provision: provision,
    ping: ping,
    squat: squat,
    populate: populate
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
