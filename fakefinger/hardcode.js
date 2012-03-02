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
    'leidenuniv.nl': 'surfnet',
    'leiden.edu': 'surfnet',
    'uva.nl': 'surfnet',
    'vu.nl': 'surfnet',
    'eur.nl': 'surfnet',
    'maastrichtuniversity.nl': 'surfnet',
    'ru.nl': 'surfnet',
    'rug.nl': 'surfnet',
    'uu.nl': 'surfnet',
    'tudelft.nl': 'surfnet',
    'utwente.nl': 'surfnet',
    'tue.nl': 'surfnet',
    'tilburguniversity.edu': 'surfnet',
    'wur.nl': 'surfnet',
    'wageningenuniversity.nl': 'surfnet',
    'ou.nl': 'surfnet',
    'lumc.nl': 'surfnet',
    'amc.nl': 'surfnet'
  };
  return function(userAddress) {
    var parts = userAddress.split('@');
    if(parts.length==2) {
      var domain = parts[1];
      while(domain.indexOf('.')!=-1) {
        console.log('trying '+domain);
        if(domains[domain] && servers[domains[domain]]) {
          var blueprint = servers[domains[domain]];
          console.log('hardcoded!');
          return {
            api: blueprint.api,
            auth: blueprint.authPrefix+userAddress+blueprint.authSuffix,
            template: blueprint.templatePrefix+userAddress+blueprint.templateSuffix
          };
        } else {
          domain=domain.substring(domain.indexOf('.')+1);
          console.log('changed domain to '+domain);
        }
      }
    }
    return null;
  };
})();
