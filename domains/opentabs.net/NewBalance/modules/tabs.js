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
//tabs[userAddress][currency] = {//ordered by timestamp, incr
//  timestamp: {
//    from: 'user@host',
//    to: 'user@host',
//    message: {
//      verb: 'propose'/'decline'/'accept'/'ack',
//      tab: {
//        borrower: 'user@host',
//        lender: 'user@host',
//        currency: 'USD',
//      },
//      revision: {
//        timestamp: 1234567890.123,
//        balance: -123.45
//      },
//      previous: 1234567890.123/null,
//      diff: -123.45
//      comment: '...'
//    },
//    signature: '...' (pgp of utf-8 canonical json of message)
//  },
//  ...
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
  function store(userAddress, message) {
    if(!tabs[userAddress]) {
      tabs[userAddress] = {};
    }
    if(!tabs[userAddress][message.currency]) {
      tabs[userAddress][message.currency] = {};
    }
    tabs[userAddress][message.currency][message.revision.timestamp] = message;
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }
  function getTab(userAddress, currency) {
    if(!tabs[userAddress]) {
      return undefined;
    }
    return tabs[userAddress][currency];
  }
  return {
    getTabs: getTabs,
    getTab: getTab,
    store: store
  }
})();
