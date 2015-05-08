var Hoek = require('hoek');
var merge = Hoek.merge;
var TokenBuilder = require('../../../helpers/token-builder');
var SessionBase = require('../helpers/session');
var isAuth = require('../helpers/is-auth');
var Connect = require('../../../connect/index');
var Boom = require('boom');

exports.status = function (request, reply) {
  request.session.get()
    .then(function (session) {
      if(!isAuth.facebook(session) || !isAuth.twitter(session)) {
        return reply.view('auth/status', {auth: session, token: token }).code(401);
      }

      var token = request.session.token;
      var isUserAuth = isAuth(session);
      var statusCode =  isUserAuth || Boom.unauthorized;
      console.log(session)
      reply.view('auth/status', {auth: session, token: token })
        .code(statusCode);
    })
    .catch(function (err) {
      reply(Boom.unauthorized);
    })
};

exports.authentication = function (request, reply) {
  var credentials = request.auth.credentials;
  var hasRedirect = credentials.query.redirect;
  var token = credentials.query.token;
  var networkName = credentials.provider;
  var Session = new SessionBase(token);

  Session
    .merge(buildNetworkStatus(networkName, credentials));

  Session
    .serialize()
    .then(redirectIfNecessary(reply, credentials))
    .then(function(token) {
      reply({ token: token });
    });
};

exports.user = function (request, reply) {
  request.session.get()
    .then(function(session) {
      if(!isAuth.twitter(session)) {
        reply().code(401);
      }
      var Twitter = new Connect(['twitter'], session);
      Twitter.User.current()
        .then(function(user) {
          reply.view('auth/user', {user: user[0]})
        });
    })
};

var buildNetworkStatus = function (networkName, session) {
  var result = {};
  var field = result[networkName] = {};

  if (session.token) {
    field.token = session.token;
  }

  if (session.secret) {
    field.secret = session.secret;
  }

  return result;
};

var buildURLForRedirect = function (credentials, token) {
  var redirectURL = credentials.query.redirect || '';
  return redirectURL + '?token=' + token;
};

var isNecessaryRedirect = function (credentials) {
  return credentials.query.redirect ? true : false;
};

var redirectIfNecessary = function(reply, credentials) {
  return function (token) {
    if (isNecessaryRedirect(credentials)) {
      return reply().redirect(buildURLForRedirect(credentials, token));
    }
    return token;
  };
};

var replyStatus = function(reply, token) {
  return function (session) {
    var statusCode = isAuth(session) || 401;
    reply.view('auth/status', {auth: session, token: token })
      .code(statusCode);
  };
};
