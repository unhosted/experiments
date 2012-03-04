var dbox = require('dbox'),
  dropboxConfig = require('./dropboxConfig').dropboxConfig;
var client = dbox.createClient(dropboxConfig);
client.request_token(function(status, reply){
  console.log(status);
  console.log(reply);
});
