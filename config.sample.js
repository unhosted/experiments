var backends = {
  statics: 8001,
  facade: 8002,
  proxy: 8003
};
exports.config = {
  couch: {
    host: '<you>.iriscouch.com',
    port: 5984,
    usr: 'remoteCouch',
    pwd: '<pwd>'
  },
  backends: backends,
  passwords: {
    'test@example.com': '<pwd>'
  },
  defaultPort: backends.statics,
  proxyHost: 'proxy.example.com',
  facadeHost: 'example.com',
  vhosts: {
    'example.com' : backends.facade,
    'proxy.example.com' : backends.proxy
  }
};
