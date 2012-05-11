exports.config = {
  port: 80,
  redirect: {
    'www.libredocs.org' : 'libredocs.org',
    'www.libredoc.org' : 'libredocs.org',
    'libredoc.org' : 'libredocs.org'
  },
  handler: {
    'proxy.unhosted.org': '/home/ubuntu/experiments/proxy-unhosted-org',
    'libredocs.org': '/home/ubuntu/libredocs',
    'proxy.libredocs.org': '/home/ubuntu/libredocs/proxy',
    'jan.libredocs.org': '/home/jan/libredocs',
    'proxy.jan.libredocs.org': '/home/jan/libredocs/proxy',
    'azul.libredocs.org': '/home/azul/libredocs',
    'proxy.azul.libredocs.org': '/home/azul/libredocs/proxy',
    'mich.libredocs.org': '/home/mich/libredocs',
    'proxy.mich.libredocs.org': '/home/mich/libredocs/proxy',
    //'surf.unhosted.org': '/home/ubuntu/experiments/surver'
    'surf.unhosted.org': '/home/mich/express-storage'
  }
};

