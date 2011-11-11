var controller= (function() {
  var updateView = function() {}
  function init(setUpdateViewCb) {
    updateView = setUpdateViewCb;
  }
  function setCallbacks(callbacks) {
    callbacks.onMsg=function(data) {
      console.log('incoming msg!');
      console.log(data);
      if(crypto.verifySignature(data)) {
        tabs.store(data.from, data);
        showContact(data.from, 'rest');
      } else {
        alert('messages signature from '+data.from+' does not match!');
      }
    };
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
  function calcTabType(userAddress, currency) {
    var me = localStorage.userAddress;
    return (tabs.getLastEntry(userAddress, currency).message.tab.borrower == me ? 'B' : 'L');
  }
  function calcTabStatus(userAddress, currency) {
    var lastEntry = tabs.getLastEntry(userAddress, currency);
    var me = localStorage.userAddress;
    return 'pendingOut';
  }
  function calcTabIcon(tabStatus) {
    if(tabStatus == 'pendingIn' || tabStatus == 'pendingOut') {
      return '?';
    }
    if(tabStatus == 'hurry') {
      return '!';
    }
    if(tabStatus == 'cancelled') {
      return 'X';
    }
    if(tabStatus == 'sentOut' || tabStatus == 'sentIn' || tabStatus == 'closed') {
      return '&check;';
    }
    return '';
  }
  function calcTabDescription(userAddress, currency) {
    var lastEntry = tabs.getLastEntry(userAddress, currency);
    if(lastEntry) {
      return lastEntry.message.revision.balance+' '+lastEntry.message.tab.currency;
    } else {
      return 'no entries in this tab';
    }
  }
  function calcTabActions(status) {
    if(status == 'pendingIn') {
      return {accept: 'Accept', declineA: 'Decline'};
    }
    if(status == 'declining') {
      return {input: 'message', cancelDecline: 'Cancel', declineB: 'Decline'};
    }
    return {};
  }
  function calcTabList(status) {
    if(status == 'pendingIn' || status == 'declining' || status == 'pendingOut') {
      return 'important';
    }
    return 'history';
  }
  function showContact(userAddress, interfaceState) { 
    //no RTTs here! this should be snappy:
    var obj = contacts.getUser(userAddress);
    obj.important = [];
    obj.history = [];
    var peerTabs = tabs.getTabs(userAddress);
    for(var currency in peerTabs) {
      thisTab = peerTabs[currency];
      thisTab.description = calcTabDescription(userAddress, currency);
      thisTab.status = calcTabStatus(userAddress, currency);
      thisTab.icon= calcTabIcon(userAddress, currency);
      thisTab.type = calcTabType(userAddress, currency);
      thisTab.actions = calcTabActions(userAddress, currency);
      obj[calcTabList(thisTab.status)].push(thisTab);
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
      currency: text,
      comment: ''
    };
  }
  function createEntry(userAddress, params, borrow) {
    var parsed = parseTabCreationText(params.text);
    var lastEntry = tabs.getLastEntry(userAddress, currency);
    if(lastEntry) {
      previousTimestamp = lastEntry.message.revision.timestamp;
      previousBorrow = (lastEntry.message.tab.borrower == me);
      if(previousBorrow == borrow) {
        previousBalance = lastEntry.message.revision.balance;
      } else {
        previousBalance = -(lastEntry.message.revision.balance);
      }
    } else {
      return {
        timestamp: null,
        balance: 0
      };
    }
    var previousRevision = getCurrRevision(userAddress, parsed.currency);
    var diff = parsed.amount;
    var me = localStorage.userAddress;
    var entry = {
      from: me,
      to: userAddress,
      message: {
        verb: params.verb,
        tab: {
          borrower: (borrow ? me : userAddress),
          lender: (borrow ? userAddress : me),
          currency: parsed.currency
        },
        revision: {
          timestamp: (new Date().getTime())/1000,
          balance: previousRevision.balance + diff
        },
        previous: previousRevision.timestamp,
        diff: diff,
        comment: parsed.comment
      }
    }
    entry.signature = crypto.sign(entry.message);
    tabs.store(userAddress, entry);
    msg.sendMsg(entry);
  }
  function globalAction(contactId, amount, currency, description) {
  }
  function triggerAction(userAddress, action, params) {
    if(action == 'borrowA') {
      return 'borrowDialog';
    } else if(action == 'lendA') {
      return 'lendDialog';
    } else if(action=='borrowB') {
      createEntry(userAddress, params, true);
      return 'rest';
    } else if(action=='lendB') {
      createEntry(userAddress, params, false);
      return 'rest';
    } else if(action=='cancel') {
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
  function tabAction(userAddress, tabId, action, params) {
    if(action=='acceptLatest') {
      createEntry(userAddress, tabId, crypto.sign(tabs.getTab(userAddress, tabId)));
    } else if(action=='declineLatestA') {
      createEntry(userAddress, tabId, 'declining');
    } else if(action=='declineLatestB') {
      tabs.comment(userAddress, tabId, 'declined: '+params.text);
      createEntry(userAddress, tabId, 'declined');
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
