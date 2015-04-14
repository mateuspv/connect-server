exports.register = function (Server, options, next) {
  var plugins = [
    { register: require('bell') },
    { register: require('hapi-auth-jwt2') },
    { register: require('./_session/index') },
    { register: require('./auth/index') },
    { register: require('./connect/index') },
    { register: require('lout') }
  ];

  var pluginOptions = {
    routes: {
      prefix: '/api'
    }
  };

  Server.register(plugins, pluginOptions, function(err) {
    if (err) {
      throw err;
    }

    next();
  });
};

exports.register.attributes = {
  name: 'api',
  main: 'index'
};
