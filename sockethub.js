var socketio = require('socket.io').listen(9000).sockets,
  config = require('./config').config;
var sockets = {};
var msgQ = {};

//this is for testing:
var testingContacts = [];

socketio.on('connection', function(socket) {
  socket.on('register', function(data) {
    if(data.secret == config.socketHubSecret) {
      sockets[data.userAddress] = socket;
      console.log('registered '+data.userAddress);
      socket.emit('welcome', data.userAddress);

      //this is for testing:
      socket.emit('contacts', testingContacts);
      testingContacts.push(data.userAddress);

      if(msgQ[data.userAddress]) {
        for(var i in msgQ[data.userAddress]) {
	  socket.emit('msg', msgQ[data.userAddress][i]);
	}
	delete msgQ[data.userAddress];
      }
    }
  });
  socket.on('msg', function(data) {
    console.log('message for '+data.to);
    if(sockets[data.to]) {
      sockets[data.to].emit('msg', data);
      console.log('delivered');
    } else {
      if(!msgQ[data.to]) {
        msgQ[data.to]=[];
      }
      msgQ[data.to].push(data);
      console.log('queued');
    }
  });
});
