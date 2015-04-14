var SessionBase = require('./helpers/session');

exports.register = function (Server, options, next) {
  require('./jwt-auth')(Server);

  var createSession = function (request) {
    var queryToken = request.query.token;
    var payloadToken = request.payload ? request.payload.token : false;
    var token = queryToken || payloadToken || '';
    return new SessionBase(token);
  };

  Server.ext('onPreHandler', function (request, reply) {
    var Session = createSession(request);
    request.session = Session;
    return reply.continue();
  });

  Server.ext('onPreResponse', function (request, reply) {
    var session = request.session;

    if (!session) {
      return reply.continue();
    }

    session.build()
      .then(function (token) {
        return reply(request.response)
          .header('token', token);
      });
  });

  next();
};

exports.register.attributes = {
  name: 'connect-session',
  main: 'index.js'
};
