var msg = (function() {
  var socket = io.connect('http://opentabs.net:9000');
  function init(userAddress, secret, onErr, onMsg, onReg) {
    var dataObj = {
      userAddress: userAddress,
      secret: secret
    };
    //listen client-side:
    socket.on('go away', onErr);
    socket.on('welcome', onReg);
    socket.on('msg', onMsg);
    socket.emit('register', dataObj);
    console.log('emitted register '+dataObj.userAddress);
  }
  function sendMsg(to, msg) {
    var dataObj = {
      to: to,
      msg: msg
    };
    socket.emit('msg', dataObj);
  }
  return {
    init: init,
    sendMsg: sendMsg,
    getCharacters: function(cb) {
      var names = ['Butch', 'Zed', 'Marcellus', 'Jules', 'Mia', 'Fabienne', 'Vincent'];
      var characters = [];
      for(var i in names) {
        characters.push({ name: names[i], avatar:'http://opentabs.net/screens/avatars/'+names[i]});
      }

      cb(characters);
    },
    isConnected: function() {
      return false;
    }
  };
})();
