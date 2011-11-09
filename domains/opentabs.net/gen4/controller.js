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
      //it's OK if contacts are added one-by-one in async here:
      contacts.getContacts(function(contactAddress) {
        showUser(contactAddress, 'rest');
      });
      origOnWelcome();
    };
    msg.setCallbacks(callbacks);
  }
  function calcUserActions(interfaceState) {
    if(interfaceState == 'rest') {
      return {
        borrowA: 'Borrow',
        lendA: 'Lend'
      };
    } else if(interfaceState == 'borrowDialog') {
      return {
        input: 'descr',
        borrowB: 'Send',
        cancel: 'X'
      };
    } else if(interfaceState == 'lendDialog') {
      return {
        input: 'descr',
        lendB: 'Send',
        cancel: 'X'
      };
    } else {
      return {};
    }
  }
  function showUser(contactAddress, interfaceState) { 
    //no RTTs here! this should be snappy:
    var obj = contacts.getUser(contactAddress);
    obj.notif = tabs.getTabs(contactAddress);
    obj.actions = calcUserActions(interfaceState);
    updateView(contactAddress, obj);
  }
  function setUserAddress(contactAddress, secret) {
    msg.register(contactAddress, secret);
  }
  function testSecret(secret) {
    msg.testSecret(secret);
  }
  //function addContact(contactAddress) {
  //}
  function globalAction(contactId, amount, currency, description) {
  }
  function triggerAction(contactAddress, action) {
    return 'borrowDialog';
  }
  function contactAction(contactAddress, action) {
    var newState = triggerAction(contactAddress, action);//no RTTs here! this should be snappy
    //redraw contact from scratch:
    showUser(contactAddress, newState);
  }
  function tabAction(contactId, tabId, action) {
  }
  function getCharacters(cb) {
    contacts.getCharacters(cb);
  }
  return {
    getCharacters: getCharacters,
    init: init,
    setCallbacks: setCallbacks,
    setUserAddress: setUserAddress,
    testSecret: testSecret,
    globalAction: globalAction,
    contactAction: contactAction,
    tabAction: tabAction
  };
})();
