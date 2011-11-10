var crypto = (function() {
  function sign(message) {
    //FIXME: fake!
    return 'yours truly';
  }
  function verifySender(message) {
    //FIXME: fake!
    if(tab.borrower == localStorage.userAddress) {
      return tab.lender;
    }
    if(tab.lender == localStorage.userAddress) {
      return tab.borrower;
    }
    return null;
  }
  return {
    sign: sign,
    verifySender: verifySender
  };
})();
