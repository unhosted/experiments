exports.config = {
  port: 80,
  host: {
    'libredocs.org': '/pimper'
  },
  pathHandler: {
    'libredocs.org/browserid-verifier': '/browserid',
  }
};
