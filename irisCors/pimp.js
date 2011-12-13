var pimper = (function() {
  var couchAddress, adminUsr, adminPwd;//using module globals here to limit func args
  function httpPut(address, value, withCredentials, attachment, contentType) {
    var options=' -X PUT';
    if(value) {
      options += " -d'"+value+"'";
    }
    if(attachment) {
      options += ' --data-urlencode '+attachment;
    }
    if(contentType) {
      options += ' -H "'+contentType+'"';
    }
    if(withCredentials) {
      host = 'http://'+adminUsr+':'+adminPwd+'@'+address;
    } else {
      host = 'http://'+address;
    }
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
  function pimp(userAddress, password) {
    var userAddressParts = userAddress.split('@');
    if(userAddressParts.length != 2) {
      return '"'+userAddress+'" is not a user address';
    }
    couchAddress = userAddressParts[1]+':5984';
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
//            '      <?xml version=\"1.0\\" encoding=\\\"UTF-8\\\\"?>'+
//            '      <XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0" xmlns:hm="http://host-meta.net/xrd/1.0">'+
//            '        <hm:Host xmlns=\'http://host-meta.net/xrd/1.0\'>'+couchAddress+'</hm:Host>'+
//            '        <Link rel=\'lrdd\' template=\'http://'+couchAddress+'/cors/_design/well-known/_show/webfinger?q={uri}\'/>'+
            '      </XRD>\\",'+
            '\\"headers\\": {\\"Access-Control-Allow-Origin\\": \\"*\\"}'+
//          '\"};}\",'+
//        '\"webfinger\":'+ 
//          '\"function\(doc, req\) { return {\"'+
//            " \"body\": \""+
//            "    <?xml version='1.0' encoding='UTF-8'?>"+
//            "    <XRD xmlns='http://docs.oasis-open.org/ns/xri/xrd-1.0' xmlns:hm='http://host-meta.net/xrd/1.0'>"+
//            "      <hm:Host xmlns='http://host-meta.net/xrd/1.0'>"+couchAddress+"</hm:Host>"+
//            "      <Link"+
//            "        rel='remoteStorage'"+
//            "        api='CouchDB'"+
//            "        auth='http://"+couchAddress+"/cors/auth/modal.html'"+
//            "        template='http://michielbdejong.iriscouch.com/cors/_design/proxy/{uri}/'"+
//            "      />"+
//            "    </XRD>\","+
//            " \"headers\": {\"Access-Control-Allow-Origin\": \"*\"}"+
//          '\"};}\",'+
//        '\"vep":'+
//          '\" function\(doc, req\) { return { \"body\": \"\(coming soon\)\",'+
//            "\"headers\": {\"Access-Control-Allow-Origin\": \"*\"}"+
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
pimper.pimp('me@michiel.iriscouch.com', 'asdf');
