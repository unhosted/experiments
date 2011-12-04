exports.config = {
  port: 80,
  sslPort: 443,
  sslDir: 'ssl-cert/',
  redirect: {
    'www.myfavouritesandwich.org': 'myfavouritesandwich.org'
  },
  host: {
    'myfavouritesandwich.nodejitsu.com': 'MyFavouriteSandwich.org/',
    'myfavouritesandwich.org': 'MyFavouriteSandwich.org/',
  }
};
