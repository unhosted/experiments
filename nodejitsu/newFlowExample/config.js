exports.config = {
  port: 80,
  pathHandler: {
    'myfavouritecontact.org/verifier': './mfcBrowserId/',
    'contacts.guardcat.org/verifier': './gcBrowserId/'
  },
  host: {
    'contacts.guardcat.org': 'contacts.guardcat.org/',
    'yourremotestorage.com': 'yourremotestorage.com',
    'myfavouritecontact.org': 'myfavouritecontact.org/'
  }
};
