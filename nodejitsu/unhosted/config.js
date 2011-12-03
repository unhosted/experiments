exports.config = {
  port: 80,
  redirect: {
    'www.unhost.it': 'unhosted.org',
    'www.federoni.org': 'unhosted.org',
    'www.appsapp.org': 'unhosted.org',
    'www.syncstorage.org': 'unhosted.org',
    'www.apptorrent.mobi': 'unhosted.org',
    'www.apptorrent.org': 'unhosted.org',
    'www.apptorrent.net': 'unhosted.org',
    'www.milosurdie.info': 'unhosted.org',
    
    'unhost.it': 'unhosted.org',
    'federoni.org': 'unhosted.org',
    'appsapp.org': 'unhosted.org',
    'syncstorage.org': 'unhosted.org',
    'apptorrent.mobi': 'unhosted.org',
    'apptorrent.org': 'unhosted.org',
    'apptorrent.net': 'unhosted.org',
    'milosurdie.info': 'unhosted.org',
    
    'www.unhosted.org': 'unhosted.org'
  },
  path: {
    'unhosted.org/remoteStorage.js': 'remoteStorage.js/files/remoteStorage.js',
  },
  host: {
    'unhosted.nodejitsu.com': 'remoteStorage.js/files/',
    'unhosted.org': 'website/'
  }
};
