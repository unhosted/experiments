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
  function store(userAddress, tab) {
    if(!tabs[userAddress]) {
      tabs[userAddress] = [];
    }
    tabs[userAddress].push(tab);
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }
  function cancel(userAddress, timestamp) {
    if(!tabs[userAddress]) {
      return false;
    }
    for(var i in tabs[userAddress]) {
      if(tabs[userAddress][i].timestamp == timestamp) {
        tabs[userAddress].splice(i, 1);
        localStorage.setItem('tabs', JSON.stringify(tabs));
        return true;
      }
    }
    return false;
  }
  return {
    getTabs: getTabs,
    store: store,
    cancel: cancel
  }
})();
