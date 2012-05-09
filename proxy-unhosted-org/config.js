exports.config = {
  port: 80,
  redirect: {
    'useraddress.net': 'http://proxy.unhosted.org'
  },
  host: {
    'proxy.unhosted.org': '/static'
  },
  pathHandler: {
    //CORS  and API key proxying:
    'proxy.unhosted.org/CouchDB': './proxy',
    'proxy.unhosted.org/Dropbox': './proxy',
    'proxy.unhosted.org/GData': './proxy',
    'proxy.unhosted.org/host-meta': './proxy',
    'proxy.unhosted.org/webfinger': './proxy',
    //fakefinger:
    'proxy.unhosted.org/irisCouchCheck': './fakefinger',
    'proxy.unhosted.org/lookup': './fakefinger',
    'proxy.unhosted.org/setUser': './fakefinger',
    'proxy.unhosted.org/setHostDefault': './fakefinger',
    //password service:
    'proxy.unhosted.org/setPwd': './pwdService',
    'proxy.unhosted.org/getPwd': './pwdService',
    'proxy.unhosted.org/': './',
    //socket hub:
    'proxy.unhosted.org/sockethub': './sockethub',
    //IrisCouch:
    'proxy.unhosted.org/provisionIrisCouch': './provision',
  }
};
