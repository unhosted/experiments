var controller= (function() {
  var updateView = function() {}
  function init(setUpdateViewCb) {
    updateView = setUpdateViewCb;
  }
  function setUserAddress(userAddress, secret, onErr, cb) {
    msg.register(userAddress, secret, onErr, function() {
      localStorage.setItem('userAddress', userAddress);
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
      cb();
    });
  }
  function onMsg(data) {

  }
  function testSecret(secret, onErr, cb) {
    msg.testSecret(secret, onErr, cb);
  }
  function addContact(userAddress) {
  }
  function borrow(contactId, amount, currency, description) {
  }
  function lend(contactId, amount, currency, description) {
  }
  function tabAction(contactId, tabId, action) {
  }
  return {
    init: init,
    setUserAddress: setUserAddress,
    testSecret: testSecret,
    addContact: addContact,
    borrow: borrow,
    lend: lend,
    tabAction: tabAction
  };
})();
