exports.config = {
  port: 80,
  pathHandler: {
    'myfavouritecontact.org/verifier': './browserid/'
  },
  host: {
    'myfavouritecontact.org': 'content/'
  }
};
