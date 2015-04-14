exports.register = function (Server, options, next) {
  require('./config/auth')(Server);
  Server.route(require('./config/routes.js'));
  next();
};

exports.register.attributes = {
  name: 'Auth',
  version: '1.0.0'
};

