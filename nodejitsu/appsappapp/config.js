exports.config = {
  port: 80,
  redirect: {
    'www.appsapp.org': 'http://appsapp.org/'
  },
  host: {
    'appsapp.nodejitsu.com': 'appsapp/',
    'appsapp.org': 'appsapp/',
  }
};
