var Hoek = require('hoek');
var merge = Hoek.merge;
var TokenBuilder = require('../../../helpers/token-builder');
var SessionBase = require('../helpers/session');
var isAuth = require('../helpers/is-auth');

exports.status = function (request, reply) {
  var token = request.query.token;

  TokenBuilder.verify(token)
    .then(replyStatus(reply, token))
    .catch(replyStatus(reply, ''));
};

exports.check = function (request, reply) {
  var token = request.query.token;
  var tw = require('../../../connect/providers/twitter');
  TokenBuilder.verify(token)
    .then(function(session) {
      var Twitter = new tw(session.twitter)
      reply(Twitter.request({url: "/application/rate_limit_status"}))
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
    var isConnectAuth = (isAuth.facebook(session) && isAuth.twitter(session));
    var statusCode = isConnectAuth || 401;
    reply.view('auth/status', {auth: session, token: token })
      .code(statusCode);
  };
};
