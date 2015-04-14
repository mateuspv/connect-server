/**
 * Facebook provider warps 'FB' with promise and provide an connect friendly API
 * @type {Function}
 */
var FB = require('fb');
var merge = require('hoek').merge;
var Promise = require('es6-promise').Promise;

/**
 * Facebook Request API
 * @param {Object} Keys with key property {facebook: {token: 'TOKEN'}}
 * @param {[Object]} provider to repass request with same API of `FB` module
 */
var Facebook = function(Keys, provider) {
  this._token = Keys.token;
  this._provider = provider || FB;
};

/**
 * request
 * @param  {String} url for request
 * @param  {String} method
 * @param  {[Object]} options
 * @return {Promise}
 */
Facebook.prototype.request = function (req) {
  var self = this;
  var url = req.url;
  var method = req.method || 'GET';
  var options = {'access_token': self._token};
  var fields = req.options || {};

  merge(options, fields);

  return new Promise(function(resolve, reject) {
    self._provider.api(url, method, options, function (res) {
      if (!res || res.error) {
        console.log('facebook', res.error);
        return reject(res);
      }

      return resolve(res);
    });
  });
};

module.exports = Facebook;
