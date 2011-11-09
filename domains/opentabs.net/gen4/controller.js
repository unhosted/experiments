var controller= (function() {
  var updateView = function() {}
  function init(setUpdateViewCb) {
    updateView = setUpdateViewCb;
  }
  function setCallbacks(callbacks) {
    callbacks.onMsg=function(data) {
      console.log('incoming msg!');
      console.log(data);
      var sender = crypto.verifySender(data.msg);
      tabs.store(sender, data.msg);
      showContact(sender, 'rest');
    }
    var origOnWelcome = callbacks.onWelcome;
    callbacks.onWelcome = function() {
      //it's OK if contacts are added one-by-one in async here:
      contacts.getContacts(function(userAddress) {
        showContact(userAddress, 'rest');
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
  function chooseIcon(tab) {
    return '?';
  }
  function chooseDescription(tab) {
    return tab.amount+' '+tab.currency;
  }
  function chooseActions(tab) {
    return {
      cancel: 'Cancel'
    };
  }
  function showContact(userAddress, interfaceState) { 
    //no RTTs here! this should be snappy:
    var obj = contacts.getUser(userAddress);
    obj.notif = [];
    obj.track = [];
    obj.open = [];
    obj.history = [];
    var peerTabs = tabs.getTabs(userAddress);
    for(var i in peerTabs) {
      var thisTab = peerTabs[i];
      thisTab.icon= chooseIcon(thisTab);
      thisTab.description = chooseDescription(thisTab);
      thisTab.actions = chooseActions(thisTab);
      obj.track.push(thisTab);
    }
    obj.actions = calcUserActions(interfaceState);
    updateView(userAddress, obj);
  }
  function setUserAddress(userAddress, secret) {
    msg.register(userAddress, secret);
  }
  function testSecret(secret) {
    msg.testSecret(secret);
  }
  //function addContact(userAddress) {
  //}
  function parseTabCreationText(text) {
    return {
      amount: 1,
      currency: text
    };
  }
  function createTab(userAddress, params, borrow) {
    var tab = parseTabCreationText(params.text);
    var me = localStorage.userAddress;
    if(borrow) {
      tab.borrower=me;
      tab.lender=userAddress;
    } else {
      tab.borrower=me;
      tab.lender=userAddress;
    }
    tab.timestamp = (new Date().getTime())/1000;
    tab.signatures = {};
    tab.signatures[me] = crypto.sign(tab);
    tabs.store(userAddress, tab);
    msg.sendMsg(userAddress, tab);//interesting questions whether msg should have implicit or explicit speech act verbs
  }
  function globalAction(contactId, amount, currency, description) {
  }
  function triggerAction(userAddress, action, params) {
    if(action == 'borrowA') {
      return 'borrowDialog';
    } else if(action == 'lendA') {
      return 'lendDialog';
    } else if(action=='borrowB') {
      createTab(userAddress, params, true);
      return 'rest';
    } else if(action=='lendB') {
      createTab(userAddress, params, false);
      return 'rest';
    } else {
      alert('action not recognised: '+action);
      return 'rest';
    }
  }
  function contactAction(userAddress, action, params) {
    var newState = triggerAction(userAddress, action, params);//no RTTs here! this should be snappy
    //redraw contact from scratch:
    showContact(userAddress, newState);
  }
  function tabAction(userAddress, tabId, action) {
    if(action=='cancel') {
      tabs.cancel(userAddress, tabId);
    } else {
      alert('action not recognised: '+action);
    }
    showContact(userAddress, 'rest');//TODO: track interfaceState per contact in some way
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
