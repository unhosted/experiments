var http = require('http'),
  cradle = require('cradle'),
  config = require('./config').config;

//
// Create a connection
//
var conn = new(cradle.Connection)(config.couch.host, config.couch.port, {
  cache: true,
  raw: false,
  auth: {username: config.couch.usr, password: config.couch.pwd}
});

//
// Get a database
//
var database = conn.database('newyorkcity');

database.create();

//
// Now work with it
//
database.save('flatiron', {
  description: 'The neighborhood surrounding the Flatiron building',
  boundaries: {
    north: '28 Street',
    south: '18 Street',
    east: 'Park Avenue',
    west: '6 Avenue'
  }
}, function (err, res) {
  console.log(JSON.stringify(err));
  console.log(JSON.stringify(res)); // True
});
