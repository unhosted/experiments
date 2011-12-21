var pimper = (function() {
  var couchAddress, adminUsr, adminPwd;//using module globals here to limit func args
  function httpPut(address, value, withCredentials, attachment, contentType) {
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
    if(withCredentials) {
      host = 'http://'+adminUsr+':'+adminPwd+'@'+address;
    } else {
      host = 'http://'+address;
    }
    console.log('echo curl '+options+' '+host); 
    console.log('curl '+options+' '+host); 
  }
  function createAdminUser() {
    httpPut(couchAddress+'/_config/admins/'+adminUsr, '\"'+adminPwd+'\"');
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
  function pimp(userAddress, password, proxy) {
    var userAddressParts = userAddress.split('@');
    var httpTemplate;
    if(userAddressParts.length != 2) {
      return '"'+userAddress+'" is not a user address';
    }
    couchAddress = userAddressParts[1]+':5984';
    if(proxy) {
      httpTemplate = 'http://'+proxy+userAddressParts[1]+'/{category}/';
    } else {
      httpTemplate = 'http://'+couchAddress+'/{category}/_design/remoteStorage/_show/cors/';
    }
    adminUsr = userAddressParts[0];
    adminPwd = password;
    createAdminUser();
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
  return {
    pimp: pimp
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
