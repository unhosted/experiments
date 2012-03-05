exports.config = {
  port: 80,
  redirect: {
    'www.libredocs.org' : 'http://libredocs.org',
    'www.libredoc.org' : 'http://libredocs.org',
    'libredoc.org' : 'http://libredocs.org',
    'useraddress.net': 'http://proxy.unhosted.org'
  },
  handler: {
    'myfavouritesandwich.org': '/Users/mich/Code/experiments/nodejitsu/mfs',
    'unhosted.org': '/Users/mich/Code/experiments/nodejitsu/unhosted-org',
    'proxy.unhosted.org': '/Users/mich/Code/experiments/proxy-unhosted-org',
    'unhosted.nodejitsu.com': '/Users/mich/Code/experiments/nodejitsu/unhosted-nodejitsu-com',
    'useraddress.net': '/Users/mich/Code/Node/useraddress',
    'user.unhosted.org': '/Users/mich/Code/Node/useraddress',
    'yourremotestorage.net': '/Users/mich/Code/Node/yourremotestorage',
    //'libredocs.org': '/Users/mich/Code/Node/yourremotestorage',
    'libredocs.org': '/Users/mich/Code/Node/libredocs',
    'proxy.libredocs.org': '/Users/mich/Code/Node/libredocs/proxy',
    'tos-dr.info': '/Users/mich/Code/Node/ToS-DR',
    'logg.er': '/Users/mich/Code/experiments/logger',
    'surf.unhosted.org': '/Users/mich/Code/experiments/surver',
    'surver.nodejitsu.com': '/Users/mich/Code/experiments/surver',
    'users.unhosted.org': '/Users/mich/Code/experiments/fakefinger'
  },
  host: {
    'deadbeefdeadbeefdeadbeefdeadbeef.apptorrent.net': '/Users/mich/Code/experiments/domains/apptorrent.net/',
    'appsapp.org': '/Users/mich/Code/experiments/appsapp/',
    'remotestorage.local': '/Users/mich/Code/experiments/nodejitsu/unhosted-nodejitsu-com/remoteStorage.js',
    'proxy.unhosted.org': '/Users/mich/Code/experiments/proxy-unhosted-org/static'
  },
  pathHandler: {
    'libredocs.org/browserid-verifier': '/Users/mich/Code/experiments/nodejitsu/unhosted-org/browserid',
    'libredocs.org/squat': '/Users/mich/Code/Node/libredocs/squat',
    'libredocs.org/createDb': '/Users/mich/Code/Node/libredocs/createDb',
    'libredocs.org/users': '/Users/mich/Code/Node/libredocs/users',
    'myfavouritesandwich.org/browserid-verifier': '/Users/mich/Code/experiments/nodejitsu/unhosted-org/browserid',
    'unhosted.nodejitsu.com/browserid-verifier': '/Users/mich/Code/experiments/nodejitsu/unhosted-org/browserid',
    'unhosted.org/browserid-verifier': '/Users/mich/Code/experiments/nodejitsu/unhosted-org/browserid',
    'unhosted.org/browserid2couch': '/Users/mich/Code/experiments/nodejitsu/unhosted-org/browserid2couch',
    //CORS  and API key proxying:
    'proxy.unhosted.org/CouchDB': '/Users/mich/Code/experiments/proxy-unhosted-org/proxy',
    'proxy.unhosted.org/Dropbox': '/Users/mich/Code/experiments/proxy-unhosted-org/proxy',
    'proxy.unhosted.org/GData': '/Users/mich/Code/experiments/proxy-unhosted-org/proxy',
    'proxy.unhosted.org/host-meta': '/Users/mich/Code/experiments/proxy-unhosted-org/proxy',
    'proxy.unhosted.org/webfinger': '/Users/mich/Code/experiments/proxy-unhosted-org/proxy',
    //fakefinger:
    'proxy.unhosted.org/lookup': '/Users/mich/Code/experiments/proxy-unhosted-org/fakefinger',
    'proxy.unhosted.org/setUser': '/Users/mich/Code/experiments/proxy-unhosted-org/fakefinger',
    'proxy.unhosted.org/setHostDefault': '/Users/mich/Code/experiments/proxy-unhosted-org/fakefinger',
    //password service:
    'proxy.unhosted.org/setPwd': '/Users/mich/Code/experiments/proxy-unhosted-org/pwdService',
    'proxy.unhosted.org/getPwd': '/Users/mich/Code/experiments/proxy-unhosted-org/pwdService',
    //socket hub:
    'proxy.unhosted.org/sockethub': '/Users/mich/Code/experiments/proxy-unhosted-org/sockethub',
    //IrisCouch:
    'proxy.unhosted.org/provisionIrisCouch': '/Users/mich/Code/experiments/proxy-unhosted-org/provision'
  }
};
