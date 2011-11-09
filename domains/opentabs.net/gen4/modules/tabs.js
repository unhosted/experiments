var tabs = (function() {
  function getTabs(userAddress) {
    return {
      0: {
        icon: '?',
        description: '1 EUR',
        colour: 'red',
        buttons: ['cancel']
      }
    };
  }
  return {
    getTabs: getTabs
  }
})();
