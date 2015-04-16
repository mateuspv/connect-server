var Hapi = require('hapi');
var API = require('./api/index');

var Server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
      	origin: ['*'],
      	additionalHeaders: ['token']
      }
    }
  }
});

Server.connection({
  port: (process.env.PORT || 5000)
});

require('./config/views')(Server);

// Load Plugins
Server.register(API, function (err) {
  if (err) {
    throw err;
  }
});

module.exports = Server;
