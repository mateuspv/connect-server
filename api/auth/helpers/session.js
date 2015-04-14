/**
 * "Session", manage a token
 */
var TokenBuilder = require('../../../helpers/token-builder');
var Promise = require('es6-promise').Promise;
var merge = require('hoek').merge;

var _sessionPromise = function(session) {
  return new Promise(function (resolve, reject) {
    resolve(session);
  });
};

var Session = function (token) {
  this._session = TokenBuilder.verify(token)
    .then(function (session) {
      return _sessionPromise(session);
    })
    .catch(function (err) {
      return _sessionPromise({});
    });
};

Session.prototype.set = function(field, value) {
  this._session
    .then(function (session) {
      session[field] = value;
    });
};

Session.prototype.get = function () {
  return this._session;
};

Session.prototype.merge = function (obj) {
  return this._session
    .then(function (session) {
      merge(session, obj);
    });
};

Session.prototype.serialize = function () {
  return this._session
    .then(function(session) {
      return TokenBuilder.generate(session);
    });
};

module.exports = Session;
