var socketio = require('socket.io').listen(9000).sockets,
  config = require('./config').config;
var sockets = {};
socketio.on('connection', function(socket) {
  socket.on('register', function(data) {
    if(data.secret == config.socketHubSecret) {
      sockets[data.userAddress] = socket;
      console.log('registered '+data.userAddress);
    }
  });
  socket.on('msg', function(data) {
    console.log('message for '+data.to);
    sockets[data.to].emit('msg', data);
  });
});
