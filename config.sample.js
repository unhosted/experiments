var backends = {
  statics: 8001,
  facade: 8002,
  proxy: 8003,
  userAddress: 8004
};
exports.config = {
  couch: {
    parentDomain: 'iriscouch.com',
    port: 5984,
  },
  backends: backends,
  defaultPort: backends.statics,
  proxyParentDomain: 'yourremotestorage.net',
  facadeHost: 'yourremotestorage.com',
  vhosts: {
    'yourremotestorage.com' : backends.facade,
    '*.yourremotestorage.net' : backends.proxy,
    'useraddress.net': backends.userAddress
  },
  domainsDir: 'domains/',
  sslDir: '/root/ssl-cert/',
  socketHubSecret: '<secret for Opentabs.net pilot>'
};
