var msg = (function() {
  var socket = io.connect('http://opentabs.net:9000');
  function testSecret(secret, onErr, onReg) {
    //listen client-side:
    socket.on('testErr', onErr);
    socket.on('testOK', onReg);
    socket.emit('testSecret', secret);
  }
  function register(userAddress, secret, onErr, cb) {
    socket.on('go away', onErr);
    socket.on('welcome', cb);
    socket.emit('register', {userAddress: userAddress, secret: secret});
  }
  function setMsgCb(onMsg) {
    socket.on('msg', onMsg);
  }
  function sendMsg(to, msg) {
    var dataObj = {
      to: to,
      msg: msg
    };
    socket.emit('msg', dataObj);
  }
  return {
    testSecret: testSecret,
    register: register,
    sendMsg: sendMsg,
    isConnected: function() {
      return false;
    }
  };
})();
