//message timeline:
// [> propose]+
// [< decline]+
//  > ack
//
// [> propose]+
// [< accept]+
//  > ack
//
//data structure for verbs 'propose', 'ack+decline', 'ack+accept', and if iou.diff==0, 'remind':
//tabs[userAddress][currency] = {
//  currency: 'USD',
//  balance: -123,//if i'm borrowing, then balance is negative here.
//  messages: {//ordered by timestamp, incr
//    timestamp: {
//      from: 'user@host',
//      to: 'user@host',
//      message: {
//        verb: 'propose'/'decline'/'accept'/'ack',
//        tab: {
//          borrower: 'user@host',
//          lender: 'user@host',
//          currency: 'USD',
//        },
//        revision: {
//          timestamp: 1234567890.123,
//          balance: -123.45
//        },
//        previous: 1234567890.123/null,
//        diff: -123.45
//        comment: '...'
//      },
//      signature: '...' (pgp of utf-8 canonical json of message)
//    },
//    ...
//  }
//}

var tabs = (function() {
  var tabs = JSON.parse(localStorage.getItem('tabs'));
  if(!tabs) {
    tabs = {};
  }
  function getTabs(userAddress) {
    if(tabs[userAddress]) {
      return tabs[userAddress];
    } else {
      return [];
    }
  }
  function store(userAddress, iou) {
    if(!tabs[userAddress]) {
      tabs[userAddress] = [];
    }
    if(!tabs[userAddress][iou.currency]) {
      tabs[userAddress][iou.currency] = [];
    }
    tabs[userAddress][iou.currency].push(iou);
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }
  function getTab(userAddress, currency) {
    if(!tabs[userAddress]) {
      return false;
    }
    for(var i in tabs[userAddress]) {
      if(tabs[userAddress][i].currency == currency) {
        return tabs[userAddress][i];
      }
    }
    return false;
  }
  function addSignature(userAddress, currency, timestamp, signature) {
    if(!tabs[userAddress]) {
      return false;
    }
    for(var i in tabs[userAddress]) {
      if(tabs[userAddress][i].timestamp == timestamp) {
      if(tabs[userAddress][i].timestamp == timestamp) {
        tabs[userAddress][i].signatures[localStorage.userAddress] = signature;
        localStorage.setItem('tabs', JSON.stringify(tabs));
        return true;
      }
    }
    return false;
  }
  function setStatus(userAddress, timestamp, newStatus) {
    if(!tabs[userAddress]) {
      return false;
    }
    for(var i in tabs[userAddress]) {
      if(tabs[userAddress][i].timestamp == timestamp) {
        tabs[userAddress][i].status = newStatus;
        localStorage.setItem('tabs', JSON.stringify(tabs));
        return true;
      }
    }
    return false;
  }
  return {
    getTabs: getTabs,
    getTab: getTab,
    store: store,
    setStatus: setStatus,
    addSignature: addSignature
  }
})();
