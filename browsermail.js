var Browsermail = function() {
  var sockets = {};
  require('smtp').createServer(function(connection) {
    connection.on('DATA', function(message) {
      for(var i = 0; i < message.recipients.length; i++) {
        var emailAddress = message.recipients[i].address.match(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)/g)[0];
        if(socket = sockets[emailAddress]) {
          message.on('data', function(data) {
            socket.emit('data', data);
          });
          message.on('end', function() {
            socket.emit('end');
            message.accept();
          });
        }
      }
    });
  }).listen(25);
  return {
    addForward: function(emailAddress, socket) {
      sockets[emailAddress] = socket;
    }
  }
}
  
var b = Browsermail();
  
require('socket.io').listen(8000).sockets.on('connection', function(socket) {
  b.addForward('mich@myfavouritesandwich.org', socket);
});
