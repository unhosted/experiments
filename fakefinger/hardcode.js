exports.hardcode = (function() {
  var servers={
    surfnet: {
      api: 'simple',
      authPrefix: 'http://surf.unhosted.org:4000/_oauth/',
      authSuffix: '',
      templatePrefix: 'http://surf.unhosted.org:4000/',
      templateSuffix: '/{category}/'
    }
  };
  var domains={
    'gmail.com': 'surfnet'};
  return function(userAddress) {
    var parts = userAddress.split('@');
    if(parts.length==2) {
      if(domains[parts[1]] && servers[domains[parts[1]]]) {
        var blueprint = servers[domains[parts[1]]];
        return {
          api: blueprint.api,
          auth: blueprint.authPrefix+userAddress+blueprint.authSuffix,
          template: blueprint.templatePrefix+userAddress+blueprint.templateSuffix
        };
      }
    }
    return null;
  };
})();
