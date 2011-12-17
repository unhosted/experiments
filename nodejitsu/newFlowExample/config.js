exports.config = {
  port: 80,
  pathHandler: {
    'myfavouritecontact.org/verifier': './mfcBrowserid/',
    'contacts.guardcat.org/verifier': './gcBrowserid/'
  },
  host: {
    'contacts.guardcat.org': 'contacts.guardcat.org/',
    'yourremotestorage.com': 'yourremotestorage.com',
    'myfavouritecontact.org': 'myfavouritecontact.org/'
  }
};
