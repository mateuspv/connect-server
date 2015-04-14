exports.register = function (Server, options, next) {
  Server.route(require('./routes.js'));
  next();
};

exports.register.attributes = {
  name: 'api-connect',
  version: '1.0.0',
  main: 'index'
};

