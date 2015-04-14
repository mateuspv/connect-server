var Hoek = require('hoek');
var TokenBuilder = require('./token-builder');
var Promise = require('es6-promise').Promise;

/**
 * Helpers
 */

// value -> Promise(value)
var toPromise = function(value) {
  return new Promise(function (resolve, reject) {
    resolve(value);
  });
};


/**
 * Session by token: async decrypt a token
 */
var Session = function (token) {
  this._token = token || '';
  this._isModified = false;

  this._store = TokenBuilder.verify(token)
    .then(function (session) {
      return toPromise(session);
    })
    .catch(function (err) {
      return toPromise({});
    });
};

Session.prototype.set = function(key, value) {
  var self = this;

  this._isModified = true;

  return this._store
    .then(function (store) {
      if (key && !value) {
        return key;
      }

      store[key] = value;
      return store;
    });
};

Session.prototype.get = function (key) {
  return this._store
    .then(function (session) {
      return toPromise(key ? session[key] : session);
    });
};

Session.prototype.build = function () {
  var isModified = this._isModified;
  var token = this._token;

  return this._store
    .then(function(session) {
      if (isModified) {
        return TokenBuilder.generate(session);
      }
      return token;
    });
};

module.exports = Session;
