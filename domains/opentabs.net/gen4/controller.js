var controller= (function() {
  var updateView = function() {}
  function init(setUpdateViewCb) {
    updateView = setUpdateViewCb;
  }
  function setCallbacks(callbacks) {
    callbacks.onMsg=function(data) {
    }
    var origOnWelcome = callbacks.onWelcome;
    callbacks.onWelcome = function() {
      updateView('zed@opentabs.net', {
        name: 'Zed',
        avatar: 'http://opentabs.net/screens/avatars/zed',
        notif: {
          0: {
            icon: '?',
            description: '1 EUR',
            colour: 'red',
            buttons: ['cancel']
          }
        }
      });
      origOnWelcome();
    };
    msg.setCallbacks(callbacks);
  }
  function setUserAddress(userAddress, secret) {
    msg.register(userAddress, secret);
  }
  function testSecret(secret) {
    msg.testSecret(secret);
  }
  function addContact(userAddress) {
  }
  function borrow(contactId, amount, currency, description) {
  }
  function lend(contactId, amount, currency, description) {
  }
  function tabAction(contactId, tabId, action) {
  }
  function getCharacters(cb) {
    user.getCharacters(cb);
  }
  return {
    getCharacters: getCharacters,
    init: init,
    setCallbacks: setCallbacks,
    setUserAddress: setUserAddress,
    testSecret: testSecret,
    addContact: addContact,
    borrow: borrow,
    lend: lend,
    tabAction: tabAction
  };
})();
