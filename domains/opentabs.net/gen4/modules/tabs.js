var tabs = (function() {
  var tabs = JSON.parse(localStorage.getItem('tabs'));
  if(!tabs) {
    tabs = {};
  }
  function getTabs(userAddress) {
    if(tabs.userAddress) {
      return tabs.userAddress;
    } else {
      return [];
    }
  }
  function store(userAddress, tab) {
    if(!tabs.userAddress) {
      tabs.userAddress = [];
    }
    tabs.userAddress.push(tab);
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }
  return {
    getTabs: getTabs,
    store: store
  }
})();
