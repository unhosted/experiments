exports.config = {
  port: 80,
  redirect: {
    'www.libredocs.org' : 'http://libredocs.org',
    'www.libredoc.org' : 'http://libredocs.org',
    'libredoc.org' : 'http://libredocs.org'
  },
  handler: {
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
  },
  pathHandler: {
    'libredocs.org/provision': '/home/ubuntu/libredocs/provision',
    'libredocs.org/squat': '/home/ubuntu/libredocs/squat',
    'libredocs.org/createDb': '/home/ubuntu/libredocs/createDb',
    'libredocs.org/setConfig': '/home/ubuntu/libredocs/setConfig',
    'libredocs.org/users': '/home/ubuntu/libredocs/users',
    'libredocs.org/userExists': '/home/ubuntu/libredocs/userExists',
    'azul.libredocs.org/provision': '/home/azul/libredocs/provision',
    'azul.libredocs.org/squat': '/home/azul/libredocs/squat',
    'azul.libredocs.org/createDb': '/home/azul/libredocs/createDb',
    'azul.libredocs.org/setConfig': '/home/azul/libredocs/setConfig',
    'azul.libredocs.org/users': '/home/azul/libredocs/users',
    'azul.libredocs.org/userExists': '/home/azul/libredocs/userExists',
    'jan.libredocs.org/provision': '/home/jan/libredocs/provision',
    'jan.libredocs.org/squat': '/home/jan/libredocs/squat',
    'jan.libredocs.org/createDb': '/home/jan/libredocs/createDb',
    'jan.libredocs.org/setConfig': '/home/jan/libredocs/setConfig',
    'jan.libredocs.org/users': '/home/jan/libredocs/users',
    'jan.libredocs.org/userExists': '/home/jan/libredocs/userExists',
    'mich.libredocs.org/provision': '/home/mich/libredocs/provision',
    'mich.libredocs.org/squat': '/home/mich/libredocs/squat',
    'mich.libredocs.org/createDb': '/home/mich/libredocs/createDb',
    'mich.libredocs.org/setConfig': '/home/mich/libredocs/setConfig',
    'mich.libredocs.org/users': '/home/mich/libredocs/users',
    'mich.libredocs.org/userExists': '/home/mich/libredocs/userExists',
    'libredocs.org/storeBearerToken': '/home/ubuntu/libredocs/storeBearerToken',
    'azul.libredocs.org/storeBearerToken': '/home/azul/libredocs/storeBearerToken',
    'jan.libredocs.org/storeBearerToken': '/home/jan/libredocs/storeBearerToken',
    'mich.libredocs.org/storeBearerToken': '/home/mich/libredocs/storeBearerToken'
  }
};

