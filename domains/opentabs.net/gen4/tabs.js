var tabs = (function() {
  function getTabs(userAddress, cb) {
    cb({
      0: {
        icon: '?',
        description: '1 EUR',
        colour: 'red',
        buttons: ['cancel']
      }
    });
  }
  return {
    getTabs: getTabs
  }
})();
