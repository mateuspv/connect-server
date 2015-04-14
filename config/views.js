var HapiJsonView = require('hapi-json-view');

module.exports = function (Server) {
  Server.views({
    engines: {
      js: {
        module: HapiJsonView.create(),
        compileMode: 'async'
      }
    },
    contentType: 'application/json',
    partialsPath: __dirname,
    path: 'templates',
    helpersPath: 'templates/helpers'
  });
};
